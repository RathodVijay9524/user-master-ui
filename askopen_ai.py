import os
import json
import glob
import shutil
import time
import re
from datetime import datetime
from typing import List, Dict, Optional
import difflib

# Required for Ollama integration
try:
    import ollama
except ImportError:
    print("❌ Please install ollama: pip install ollama")
    exit(1)

class AIAssistant:
    def __init__(self):
        self.conversation_history = []
        self.config = self.load_config()
        self.session_actions = []  # Track all actions taken
        self.current_model = "mistral:7b"  # Default model
        # All your installed models
        self.available_models = [
            "mistral:7b",
            "deepseek-coder:6.7b", 
            "deepseek-r1:8b",
            "deepseek-r1:1.5b",
            "qwen2.5-coder:7b",
            "qwen2.5-coder:3b",
            "qwen2.5-coder:1.5b"
        ]

    def select_model(self):
        """Let user choose which model to use"""
        print("\n🧠 Available Local Models:")
        print("=" * 40)
        
        for i, model in enumerate(self.available_models, 1):
            marker = "⭐" if model == self.current_model else "  "
            print(f"{marker} {i}. {model}")
        
        print(f"\nCurrent model: {self.current_model}")
        choice = input("\nSelect model (1-{}) or press Enter to keep current: ".format(len(self.available_models)))
        
        if choice.isdigit():
            choice_num = int(choice)
            if 1 <= choice_num <= len(self.available_models):
                self.current_model = self.available_models[choice_num - 1]
                print(f"✅ Model changed to: {self.current_model}")
            else:
                print("❌ Invalid selection. Keeping current model.")
        elif choice.strip() == "":
            print(f"✅ Keeping current model: {self.current_model}")
        else:
            print("❌ Invalid input. Keeping current model.")

    def load_config(self):
        """Load configuration from file or defaults"""
        config = {
            "backup_enabled": True,
            "max_file_size": 50000,
            "search_paths": [
                ".", "src", "src/components", "src/components/public",
                "src/components/BaseAdmin", "src/components/BaseUser", 
                "src/components/BaseWorker", "src/components/common"
            ],
            "preferred_extensions": [".jsx", ".js", ".ts", ".tsx", ".css", ".json"]
        }
        
        try:
            if os.path.exists("ai_assistant_config.json"):
                with open("ai_assistant_config.json", 'r') as f:
                    user_config = json.load(f)
                    config.update(user_config)
        except Exception as e:
            print(f"Config load error: {e}")
        
        return config

    def add_to_history(self, role: str, content: str, action_type: str = "conversation"):
        """Keep track of conversation and actions"""
        self.conversation_history.append({"role": role, "content": content, "timestamp": datetime.now().isoformat()})
        if action_type != "conversation":
            self.session_actions.append({
                "type": action_type,
                "content": content,
                "timestamp": datetime.now().isoformat()
            })
        if len(self.conversation_history) > 15:
            self.conversation_history = self.conversation_history[-15:]

    def find_file_by_name(self, partial_name: str) -> List[str]:
        """Find files by partial name search"""
        extensions = ['*.jsx', '*.js', '*.css', '*.html', '*.json', '.md', '*.ts', '*.tsx']
        found_files = []
        
        for path in self.config["search_paths"]:
            if os.path.exists(path):
                for ext in extensions:
                    pattern = os.path.join(path, f"*{partial_name}*{ext}")
                    found_files.extend(glob.glob(pattern))
        
        return sorted(list(set(found_files)))

    def smart_file_finder(self, filename: str) -> str:
        """Smart file finder that helps user select from found files"""
        print(f"\n🔍 Searching for '{filename}'...")
        found_files = self.find_file_by_name(filename)
        
        if not found_files:
            print(f"❌ No files found matching '{filename}'")
            create_new = input("📝 Create new file? (y/n): ")
            return filename if create_new.lower() == 'y' else ""
        
        if len(found_files) == 1:
            print(f"✅ Found: {found_files[0]}")
            return found_files[0]
        
        print(f"\n📋 Found {len(found_files)} files:")
        for i, file_path in enumerate(found_files, 1):
            print(f"{i:2}. {file_path}")
        
        choice = input(f"\nSelect file (1-{len(found_files)}) or 0 for new file: ")
        
        if choice.isdigit():
            choice_num = int(choice)
            if 1 <= choice_num <= len(found_files):
                return found_files[choice_num - 1]
            elif choice_num == 0:
                return filename
        
        return ""

    def backup_file(self, filename: str) -> Optional[str]:
        """Create backup before modification"""
        if self.config["backup_enabled"] and os.path.exists(filename):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_name = f"{filename}.backup_{timestamp}"
            try:
                shutil.copy2(filename, backup_name)
                print(f"✅ Backup created: {backup_name}")
                self.add_to_history("system", f"Backup created: {backup_name}", "backup")
                return backup_name
            except Exception as e:
                print(f"⚠️  Backup failed: {e}")
        return None

    def write_to_file(self, filename: str, content: str) -> bool:
        """Write content to a file with directory creation"""
        try:
            if not any(filename.endswith(ext) for ext in ['.jsx', '.js', '.css', '.md', '.json', '.html', '.ts', '.tsx']):
                if "import" in content and "from" in content:
                    filename += '.jsx'
                elif "{" in content and "}" in content and ":" in content:
                    filename += '.css'
                else:
                    filename += '.js'
            
            directory = os.path.dirname(filename)
            if directory:
                os.makedirs(directory, exist_ok=True)
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Successfully wrote to {filename}")
            self.add_to_history("system", f"File written: {filename}", "file_write")
            return True
        except Exception as e:
            print(f"❌ Error writing to {filename}: {e}")
            return False

    def read_context_intelligently(self, task_type: str) -> str:
        """Read context based on task type"""
        context = ""
        file_count = 0
        
        if task_type in ["generate_component", "modify_file"]:
            essential_files = ["package.json", "src/App.jsx", "src/main.jsx"]
            for file in essential_files:
                if os.path.exists(file):
                    try:
                        with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            if len(content) < 10000:
                                context += f"\n=== {file} ===\n{content}\n"
                                file_count += 1
                                print(f"📄 Added: {file}")
                    except: pass
            
            component_files = []
            for root, dirs, files in os.walk("src/components"):
                for file in files[:3]:
                    if file.endswith((".jsx", ".js", ".css")):
                        component_files.append(os.path.join(root, file))
                        if len(component_files) >= 3: break
                if len(component_files) >= 3: break
            
            for file_path in component_files:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        if len(content) < 5000:
                            context += f"\n=== {file_path} ===\n{content}\n"
                            file_count += 1
                            print(f"📄 Added example: {file_path}")
                except: pass
        
        else:
            return self.read_project_files_smart()
        
        print(f"\n📊 Total context files: {file_count}")
        return context

    def extract_code_from_response(self, response_text: str) -> str:
        """Robust code extraction from AI responses"""
        code_blocks = re.findall(r'```(?:\w+)?\n(.*?)```', response_text, re.DOTALL)
        
        if code_blocks:
            longest_block = max(code_blocks, key=len)
            lines = longest_block.strip().split('\n')
            if lines and lines[0].lower() in ['jsx', 'javascript', 'js', 'css', 'html', 'typescript', 'ts']:
                return '\n'.join(lines[1:]).strip()
            return longest_block.strip()
        
        return response_text.strip()

    def robust_ai_call(self, messages: List[Dict], model: str = None, max_retries: int = 3) -> Optional[Dict]:
        """Use Ollama for local AI inference"""
        # Use provided model or current selected model
        ollama_model = model if model else self.current_model

        for attempt in range(max_retries):
            try:
                print(f"🤖 Querying local Ollama model: {ollama_model}...")

                response = ollama.chat(
                    model=ollama_model,
                    messages=[{"role": msg["role"], "content": msg["content"]} for msg in messages],
                )

                return {
                    "choices": [{"message": {"content": response["message"]["content"]}}]
                }

            except Exception as e:
                print(f"❌ Ollama error (attempt {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(2)
                else:
                    return None
        return None

    def read_project_files_smart(self) -> str:
        """Read essential project files"""
        context = ""
        file_count = 0
        essential_files = [
            "package.json", "src/App.jsx", "src/main.jsx", 
            "vite.config.js", "tailwind.config.js"
        ]
        
        for file in essential_files:
            if os.path.exists(file):
                try:
                    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        if len(content) < 10000:
                            context += f"\n=== {file} ===\n{content}\n"
                            file_count += 1
                            print(f"📄 Added: {file}")
                except: pass
        
        component_examples = []
        for root, dirs, files in os.walk("src/components"):
            for file in files:
                if file.endswith((".jsx", ".js", ".css")):
                    component_examples.append(os.path.join(root, file))
                    if len(component_examples) >= 5: break
            if len(component_examples) >= 5: break
        
        for file_path in component_examples[:5]:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if len(content) < 5000:
                        context += f"\n=== {file_path} ===\n{content}\n"
                        file_count += 1
                        print(f"📄 Added example: {file_path}")
            except: pass
        
        print(f"\n📊 Total files read: {file_count}")
        return context

    def show_file_diff(self, old_content: str, new_content: str, filename: str):
        """Show actual differences between old and new content"""
        old_lines = old_content.splitlines()
        new_lines = new_content.splitlines()
        
        diff = difflib.unified_diff(
            old_lines, new_lines,
            fromfile=f'{filename} (old)',
            tofile=f'{filename} (new)',
            lineterm=''
        )
        
        print(f"\n🔄 Changes in {filename}:")
        print("=" * 60)
        has_changes = False
        for line in diff:
            has_changes = True
            if line.startswith('+') and not line.startswith('+++'):
                print(f"✅ {line}")
            elif line.startswith('-') and not line.startswith('---'):
                print(f"❌ {line}")
            elif line.startswith('@@'):
                print(f"📍 {line}")
        
        if not has_changes:
            print("No changes detected.")

    def preview_changes(self, filename: str, new_content: str):
        """Show preview of file changes"""
        if os.path.exists(filename):
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    old_content = f.read()
                self.show_file_diff(old_content, new_content, filename)
            except:
                print(f"\n📄 New file: {filename}")
                print("=" * 50)
                print(new_content[:500] + "..." if len(new_content) > 500 else new_content)
        else:
            print(f"\n📄 Creating new file: {filename}")
            print("=" * 50)
            print(new_content[:500] + "..." if len(new_content) > 500 else new_content)

    def analyze_code(self):
        """Analyze project code"""
        question = input("🤔 What's your question about the code? ")
        context = self.read_project_files_smart()
        
        messages = [
            {"role": "system", "content": "You are a senior React developer analyzing a codebase."},
            {"role": "user", "content": f"Project files:\n{context}\n\nQuestion: {question}"}
        ]
        
        self.add_to_history("user", f"Analysis request: {question}")
        
        response = self.robust_ai_call(messages)
        
        if response and response.get("choices"):
            answer = response["choices"][0]["message"]["content"]
            print("\n💡 Analysis Result:")
            print("=" * 50)
            print(answer)
            self.add_to_history("assistant", answer)
            
            save = input("\n💾 Save analysis to file? (y/n): ")
            if save.lower() == 'y':
                filename = input("📁 Filename (e.g., analysis.md): ") or "analysis.md"
                self.write_to_file(filename, f"# Code Analysis\n\n**Question:** {question}\n\n**Answer:**\n{answer}")

    def generate_code(self):
        """Generate new code using currently selected model"""
        task = input("🎯 What code do you want to generate? ")
        context = self.read_context_intelligently("generate_component")

        messages = [
            {"role": "system", "content": "You are a React developer. Generate clean, modern code that follows the project patterns."},
            {"role": "user", "content": f"Project context:\n{context}\n\nTask: {task}\nProvide only the code without explanations."}
        ]

        self.add_to_history("user", f"Generation request: {task}")
        response = self.robust_ai_call(messages)

        if response and response.get("choices"):
            response_text = response["choices"][0]["message"]["content"]
            code = self.extract_code_from_response(response_text)

            print("\n🚀 Generated Code:")
            print("=" * 50)
            print(code)
            self.add_to_history("assistant", code)

            save = input("\n💾 Save to file? (y/n): ")
            if save.lower() == 'y':
                filename = input("📁 Filename (e.g., src/components/NewComponent.jsx): ") or "GeneratedComponent.jsx"
                self.preview_changes(filename, code)
                confirm = input("\n✅ Confirm save? (y/n): ")
                if confirm.lower() == 'y':
                    self.write_to_file(filename, code)

    def modify_file(self):
        """Modify existing file"""
        filename = input("📝 Enter filename or partial name to modify: ")
        actual_filename = self.smart_file_finder(filename)
        
        if not actual_filename:
            print("❌ No file selected. Operation cancelled.")
            return
        
        if not os.path.exists(actual_filename):
            print(f"❌ File {actual_filename} does not exist!")
            return
        
        try:
            with open(actual_filename, 'r', encoding='utf-8') as f:
                current_content = f.read()
            
            print(f"\n📄 Current content of {actual_filename}:")
            print("=" * 50)
            preview_lines = current_content.split('\n')[:20]
            for i, line in enumerate(preview_lines, 1):
                print(f"{i:3}: {line}")
            if len(preview_lines) < len(current_content.split('\n')):
                print("    ...")
            
            task = input("\n🔧 What modification do you want? ")
            
            messages = [
                {"role": "system", "content": "You are a senior developer modifying existing code. Provide only the complete modified code exactly as it should appear in the file. DO NOT include markdown code blocks, explanations, or any other text."},
                {"role": "user", "content": f"File: {actual_filename}\nCurrent complete content:\n{current_content}\n\nTask: {task}\n\nIMPORTANT: Return ONLY the complete file content as it should appear after changes. Do not wrap in markdown or add any explanations."}
            ]
            
            print("🤖 Asking AI to modify the file...")
            response = self.robust_ai_call(messages)
            
            if response and response.get("choices"):
                modified_code = response["choices"][0]["message"]["content"]
                modified_code = self.extract_code_from_response(modified_code)
                
                if not modified_code or len(modified_code.strip()) < 10:
                    print("❌ AI returned empty or invalid content. Operation cancelled.")
                    return
                
                self.preview_changes(actual_filename, modified_code)
                
                confirm = input(f"\n✅ Apply changes to {actual_filename}? (y/n): ")
                if confirm.lower() == 'y':
                    backup_file = self.backup_file(actual_filename)
                    success = self.write_to_file(actual_filename, modified_code)
                    if success:
                        print(f"✅ File {actual_filename} successfully updated!")
                        self.add_to_history("system", f"Modified file: {actual_filename}", "file_modify")
                    else:
                        print(f"❌ Failed to update {actual_filename}")
                else:
                    print("❌ Changes cancelled.")
            else:
                print("❌ Failed to get response from AI. Operation cancelled.")
                
        except FileNotFoundError:
            print(f"❌ File {actual_filename} not found!")
        except Exception as e:
            print(f"❌ Error during file modification: {e}")

    def project_analysis(self):
        """Comprehensive project analysis"""
        print("📊 Analyzing project structure...")
        context = self.read_project_files_smart()
        
        messages = [
            {"role": "system", "content": "You are a technical architect analyzing a React project. Provide a comprehensive overview."},
            {"role": "user", "content": f"Analyze this React project:\n{context}\n\nProvide: 1) Project overview 2) Key features 3) Architecture 4) Recommendations"}
        ]
        
        response = self.robust_ai_call(messages)
        
        if response and response.get("choices"):
            analysis = response["choices"][0]["message"]["content"]
            print("\n📋 Project Analysis:")
            print("=" * 50)
            print(analysis)
            
            save = input("\n💾 Save analysis? (y/n): ")
            if save.lower() == 'y':
                self.write_to_file("PROJECT_ANALYSIS.md", f"# Project Analysis\n\n{analysis}")
                self.add_to_history("system", "Project analysis saved", "analysis")

    def batch_modify_files(self):
        """Modify multiple files at once"""
        print("📁 Batch File Modification")
        print("Enter files to modify (one per line, 'done' when finished):")
        
        files = []
        while True:
            filename = input("File: ").strip()
            if filename.lower() == 'done':
                break
            if filename:
                actual_filename = self.smart_file_finder(filename)
                if actual_filename:
                    files.append(actual_filename)
        
        if not files:
            print("❌ No files selected.")
            return
        
        task = input("🔧 What modification to apply to all files? ")
        
        for filename in files:
            print(f"\n📝 Processing {filename}...")
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                messages = [
                    {"role": "system", "content": "You are a developer. Modify this file according to the task."},
                    {"role": "user", "content": f"File: {filename}\nContent:\n{content}\n\nTask: {task}\n\nReturn only the modified file content."}
                ]
                
                response = self.robust_ai_call(messages)
                if response and response.get("choices"):
                    modified_content = response["choices"][0]["message"]["content"]
                    modified_content = self.extract_code_from_response(modified_content)
                    
                    if modified_content and len(modified_content.strip()) > 10:
                        self.backup_file(filename)
                        self.write_to_file(filename, modified_content)
                        print(f"✅ {filename} updated")
                    else:
                        print(f"❌ No valid content for {filename}")
                        
            except Exception as e:
                print(f"❌ Error processing {filename}: {e}")

    def code_quality_analysis(self):
        """Analyze code quality and suggest improvements"""
        filename = input("Enter file to analyze: ")
        actual_filename = self.smart_file_finder(filename)
        
        if not actual_filename or not os.path.exists(actual_filename):
            print("❌ File not found!")
            return
        
        with open(actual_filename, 'r') as f:
            content = f.read()
        
        messages = [
            {"role": "system", "content": "You are a senior developer performing code review. Analyze for: 1) Best practices 2) Performance 3) Security 4) Maintainability 5) Accessibility"},
            {"role": "user", "content": f"Code to review:\n{content}\n\nProvide specific suggestions with line numbers."}
        ]
        
        response = self.robust_ai_call(messages)
        if response:
            analysis = response["choices"][0]["message"]["content"]
            print("\n🔍 Code Quality Analysis:")
            print("=" * 50)
            print(analysis)
            
            save = input("\n💾 Save analysis? (y/n): ")
            if save.lower() == 'y':
                analysis_filename = f"{actual_filename}.analysis.md"
                self.write_to_file(analysis_filename, f"# Code Analysis for {actual_filename}\n\n{analysis}")

    def generate_project_structure(self):
        """Generate and visualize project structure"""
        print("\n🏗️  Project Structure:")
        print("=" * 40)
        
        def tree(dir_path, prefix=""):
            try:
                contents = os.listdir(dir_path)
                contents = [c for c in contents if not c.startswith('.') or c in ['.git']]
                contents.sort()
                
                pointers = ["├── "] * (len(contents) - 1) + ["└── "]
                
                for pointer, path in zip(pointers, contents):
                    full_path = os.path.join(dir_path, path)
                    if os.path.isdir(full_path):
                        print(f"{prefix}{pointer}{path}/")
                        extension = "│   " if pointer == "├── " else "    "
                        tree(full_path, prefix + extension)
                    else:
                        print(f"{prefix}{pointer}{path}")
            except PermissionError:
                print(f"{prefix}└── [Permission Denied]")
        
        tree(".")

    def compare_models_response(self):
        """Compare responses from multiple AI models"""
        print("🤖 Multi-Model Comparison")
        print("=" * 40)
        
        prompt = input("Enter your question/prompt to compare: ")
        
        # Show your available models for comparison
        print(f"\nAvailable models for comparison:")
        for i, model in enumerate(self.available_models, 1):
            print(f"{i}. {model}")
        
        selected_models = []
        print("\nEnter model numbers to compare (e.g., 1,3,2) or press Enter for all:")
        model_input = input().strip()
        
        if model_input:
            try:
                indices = [int(x.strip()) - 1 for x in model_input.split(',')]
                selected_models = [self.available_models[i] for i in indices if 0 <= i < len(self.available_models)]
            except:
                print("❌ Invalid input. Using first 3 models.")
                selected_models = self.available_models[:3]
        else:
            selected_models = self.available_models[:3]  # Default to first 3
        
        print(f"\n🔍 Comparing {len(selected_models)} models...")
        print("=" * 50)
        
        results = {}
        
        for i, model_name in enumerate(selected_models, 1):
            print(f"\n🔄 Getting response from {model_name}...")
            
            messages = [
                {"role": "system", "content": "Provide a clear, concise, and helpful response."},
                {"role": "user", "content": prompt}
            ]
            
            response = self.robust_ai_call(messages, model_name, max_retries=1)
            
            if response and response.get("choices"):
                answer = response["choices"][0]["message"]["content"]
                results[model_name] = answer
                
                print(f"\n📝 {model_name} Response:")
                print("-" * 30)
                preview = answer[:300] + "..." if len(answer) > 300 else answer
                print(preview)
                print(f"   (Response length: {len(answer)} characters)")
            else:
                print(f"❌ {model_name} failed to respond")
                results[model_name] = "Failed to get response"
        
        print(f"\n📊 Summary:")
        print("=" * 30)
        for model_name, response in results.items():
            if response != "Failed to get response":
                word_count = len(response.split())
                print(f"{model_name}: {word_count} words")
            else:
                print(f"{model_name}: Failed")
        
        save_comparison = input("\n💾 Save detailed comparison? (y/n): ")
        if save_comparison.lower() == 'y':
            comparison_content = f"# AI Model Comparison\n\nPrompt: {prompt}\n\n"
            for model_name, response in results.items():
                comparison_content += f"\n## {model_name}\n\n{response}\n\n"
                comparison_content += f"---\n"
            
            filename = f"model_comparison_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
            self.write_to_file(filename, comparison_content)
            print(f"✅ Comparison saved to {filename}")
        
        return results

    def export_session(self):
        """Export conversation history and actions"""
        session_data = {
            "timestamp": datetime.now().isoformat(),
            "conversation": self.conversation_history,
            "actions_taken": self.session_actions,
            "model_used": self.current_model
        }
        
        filename = f"session_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        self.write_to_file(filename, json.dumps(session_data, indent=2))
        print(f"💾 Session exported to {filename}")
    
    def enhanced_menu(self):
        """Enhanced menu system"""
        print("\n" + "="*70)
        print("🤖 Enhanced AI Coding Assistant v3.0")
        print("="*70)
        print(f"🧠 Current Model: {self.current_model}")
        print("1.  🎯 Select Model      - Choose which LLM to use")
        print("2.  🔍 Code Analysis     - Analyze and understand your code")
        print("3.  🚀 Code Generation   - Create new components and files")
        print("4.  🛠️  File Modification - Update existing files")
        print("5.  📊 Project Analysis  - Comprehensive project overview")
        print("6.  📁 Batch Operations  - Modify multiple files at once")
        print("7.  🎯 Code Quality      - Analyze code quality and best practices")
        print("8.  🏗️  Project Structure - Show project directory structure")
        print("9.  🤖 Model Comparison  - Compare AI models responses")
        print("10. 💾 Export Session    - Save your work session")
        print("11. 🚪 Exit")
        print("="*70)
    
    def run(self):
        """Main assistant loop"""
        print("🚀 Starting Enhanced AI Coding Assistant v3.0...")
        print(f"📚 Available models: {len(self.available_models)}")
        
        while True:
            self.enhanced_menu()
            choice = input("\nSelect option (1-11): ").strip()
            
            if choice == '1':
                self.select_model()
            elif choice == '2':
                self.analyze_code()
            elif choice == '3':
                self.generate_code()
            elif choice == '4':
                self.modify_file()
            elif choice == '5':
                self.project_analysis()
            elif choice == '6':
                self.batch_modify_files()
            elif choice == '7':
                self.code_quality_analysis()
            elif choice == '8':
                self.generate_project_structure()
            elif choice == '9':
                self.compare_models_response()
            elif choice == '10':
                self.export_session()
            elif choice == '11':
                print("👋 Goodbye! Thanks for using AI Coding Assistant!")
                break
            else:
                print("❌ Invalid option. Please try again.")
            
            input("\nPress Enter to continue...")

# Run the enhanced assistant
if __name__ == "__main__":
    assistant = AIAssistant()
    assistant.run()