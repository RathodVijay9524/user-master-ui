import os
import requests
import json
import glob
import shutil
import time
import re
from datetime import datetime
from typing import List, Dict, Optional
import difflib

class AIAssistant:
    def __init__(self):
        self.API_KEY = "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"
        self.conversation_history = []
        self.config = self.load_config()
        self.session_actions = []  # Track all actions taken
    
    def load_config(self):
        """Load configuration from file or defaults"""
        config = {
            "default_model": "mistralai/mistral-7b-instruct:nitro",
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
        if len(self.conversation_history) > 15:  # Keep last 15 interactions
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
        
        return sorted(list(set(found_files)))  # Remove duplicates and sort
    
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
            # Ensure proper file extension
            if not any(filename.endswith(ext) for ext in ['.jsx', '.js', '.css', '.md', '.json', '.html', '.ts', '.tsx']):
                if "import" in content and "from" in content:
                    filename += '.jsx'
                elif "{" in content and "}" in content and ":" in content:
                    filename += '.css'
                else:
                    filename += '.js'
            
            # Create directories if they don't exist
            directory = os.path.dirname(filename)
            if directory:
                os.makedirs(directory, exist_ok=True)
            
            # Write the file
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
            # Focus on component examples
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
            
            # Read component examples
            component_files = []
            for root, dirs, files in os.walk("src/components"):
                for file in files[:3]:  # Limit to 3 examples
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
            # General project structure reading
            return self.read_project_files_smart()
        
        print(f"\n📊 Total context files: {file_count}")
        return context
    
    def extract_code_from_response(self, response_text: str) -> str:
        """Robust code extraction from AI responses"""
        # Handle multiple code blocks - get the longest one (most likely the complete code)
        code_blocks = re.findall(r'```(?:\w+)?\n(.*?)```', response_text, re.DOTALL)
        
        if code_blocks:
            # Return the longest code block (most complete)
            longest_block = max(code_blocks, key=len)
            # Remove language identifier if present
            lines = longest_block.strip().split('\n')
            if lines and lines[0].lower() in ['jsx', 'javascript', 'js', 'css', 'html', 'typescript', 'ts']:
                return '\n'.join(lines[1:]).strip()
            return longest_block.strip()
        
        return response_text.strip()
    
    def robust_ai_call(self, messages: List[Dict], model: str, max_retries: int = 3) -> Optional[Dict]:
        """AI call with retry logic and better error handling"""
        for attempt in range(max_retries):
            try:
                response = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.API_KEY}",
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "Enhanced Code Assistant",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model,
                        "messages": messages,
                        "temperature": 0.7
                    },
                    timeout=300
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:  # Rate limited
                    print(f"⏳ Rate limited. Waiting... (attempt {attempt + 1})")
                    time.sleep(2 ** attempt)
                    continue
                else:
                    print(f"❌ API Error: {response.status_code} - {response.text}")
                    return None
                    
            except requests.exceptions.Timeout:
                print(f"⏰ Timeout on attempt {attempt + 1}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                    continue
            except Exception as e:
                print(f"❌ Request Error: {e}")
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
        
        response = self.robust_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        
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
        """Generate new code"""
        task = input("🎯 What code do you want to generate? ")
        context = self.read_context_intelligently("generate_component")
        
        messages = [
            {"role": "system", "content": "You are a React developer. Generate clean, modern code that follows the project patterns."},
            {"role": "user", "content": f"Project context:\n{context}\n\nTask: {task}\nProvide only the code without explanations."}
        ]
        
        self.add_to_history("user", f"Generation request: {task}")
        
        response = self.robust_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
        
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
        """Modify existing file - ENHANCED VERSION"""
        filename = input("📝 Enter filename or partial name to modify: ")
        actual_filename = self.smart_file_finder(filename)
        
        if not actual_filename:
            print("❌ No file selected. Operation cancelled.")
            return
        
        if not os.path.exists(actual_filename):
            print(f"❌ File {actual_filename} does not exist!")
            return
        
        try:
            # Read current content
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
            response = self.robust_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
            
            if response and response.get("choices"):
                modified_code = response["choices"][0]["message"]["content"]
                # Extract clean code (remove any markdown or extra text)
                modified_code = self.extract_code_from_response(modified_code)
                
                # Validate that we got meaningful content
                if not modified_code or len(modified_code.strip()) < 10:
                    print("❌ AI returned empty or invalid content. Operation cancelled.")
                    return
                
                # Show detailed diff
                self.preview_changes(actual_filename, modified_code)
                
                confirm = input(f"\n✅ Apply changes to {actual_filename}? (y/n): ")
                if confirm.lower() == 'y':
                    # Create backup
                    backup_file = self.backup_file(actual_filename)
                    
                    # Write the modified content
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
        
        response = self.robust_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        
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
            # Simple approach: ask AI to modify each file individually
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                messages = [
                    {"role": "system", "content": "You are a developer. Modify this file according to the task."},
                    {"role": "user", "content": f"File: {filename}\nContent:\n{content}\n\nTask: {task}\n\nReturn only the modified file content."}
                ]
                
                response = self.robust_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
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
        
        response = self.robust_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
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
                # Filter out common hidden directories
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
        
        # Available models (the ones that work with your setup)
        models = [
            ("Mistral 7B", "mistralai/mistral-7b-instruct:nitro"),
            ("Llama 3 70B", "meta-llama/llama-3-70b-instruct:nitro"),
            ("Claude 3 Haiku", "anthropic/claude-3-haiku:nitro")
        ]
        
        print(f"\n🔍 Comparing {len(models)} models...")
        print("=" * 50)
        
        results = {}
        
        for i, (model_name, model_id) in enumerate(models, 1):
            print(f"\n🔄 Getting response from {model_name}...")
            
            messages = [
                {"role": "system", "content": "Provide a clear, concise, and helpful response."},
                {"role": "user", "content": prompt}
            ]
            
            response = self.robust_ai_call(messages, model_id, max_retries=1)  # Single retry for comparison
            
            if response and response.get("choices"):
                answer = response["choices"][0]["message"]["content"]
                results[model_name] = answer
                
                print(f"\n📝 {model_name} Response:")
                print("-" * 30)
                # Show first 300 characters for preview
                preview = answer[:300] + "..." if len(answer) > 300 else answer
                print(preview)
                
                # Show response length
                print(f"   (Response length: {len(answer)} characters)")
            else:
                print(f"❌ {model_name} failed to respond")
                results[model_name] = "Failed to get response"
        
        # Summary comparison
        print(f"\n📊 Summary:")
        print("=" * 30)
        for model_name, response in results.items():
            if response != "Failed to get response":
                word_count = len(response.split())
                print(f"{model_name}: {word_count} words")
            else:
                print(f"{model_name}: Failed")
        
        # Option to save comparison
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
            "actions_taken": self.session_actions
        }
        
        filename = f"session_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        self.write_to_file(filename, json.dumps(session_data, indent=2))
        print(f"💾 Session exported to {filename}")
    
    def enhanced_menu(self):
        """Enhanced menu system"""
        print("\n" + "="*70)
        print("🤖 Enhanced AI Coding Assistant v2.0")
        print("="*70)
        print("1.  🔍 Code Analysis     - Analyze and understand your code")
        print("2.  🚀 Code Generation   - Create new components and files")
        print("3.  🛠️  File Modification - Update existing files")
        print("4.  📊 Project Analysis  - Comprehensive project overview")
        print("5.  📁 Batch Operations  - Modify multiple files at once")
        print("6.  🎯 Code Quality      - Analyze code quality and best practices")
        print("7.  🏗️  Project Structure - Show project directory structure")
        print("8.  🤖 Model Comparison  - Compare AI models responses")
        print("9.  💾 Export Session    - Save your work session")
        print("10. 🚪 Exit")
        print("="*70)
    
    def run(self):
        """Main assistant loop"""
        print("🚀 Starting Enhanced AI Coding Assistant v2.0...")
        print(f"📚 Config loaded: {len(self.config)} settings")
        
        while True:
            self.enhanced_menu()
            choice = input("\nSelect option (1-10): ").strip()
            
            if choice == '1':
                self.analyze_code()
            elif choice == '2':
                self.generate_code()
            elif choice == '3':
                self.modify_file()
            elif choice == '4':
                self.project_analysis()
            elif choice == '5':
                self.batch_modify_files()
            elif choice == '6':
                self.code_quality_analysis()
            elif choice == '7':
                self.generate_project_structure()
            elif choice == '8':
                self.compare_models_response()
            elif choice == '9':
                self.export_session()
            elif choice == '10':
                print("👋 Goodbye! Thanks for using AI Coding Assistant!")
                break
            else:
                print("❌ Invalid option. Please try again.")
            
            input("\nPress Enter to continue...")

# Run the enhanced assistant
if __name__ == "__main__":
    assistant = AIAssistant()
    assistant.run()