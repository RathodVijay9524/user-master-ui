#!/usr/bin/env python3
"""
🤖 Enhanced AI Coding Assistant v5.0
All-in-One Single File Version
"""

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
import hashlib
import pickle
import concurrent.futures
from threading import Lock

# ==================== UTILITY CLASSES ====================

class CacheManager:
    """Intelligent caching system for AI responses"""
    
    def __init__(self, cache_dir=".ai_cache"):
        self.cache_dir = cache_dir
        self.ensure_cache_dir()
    
    def ensure_cache_dir(self):
        """Create cache directory if it doesn't exist"""
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
    
    def get_cache_key(self, prompt: str, model: str) -> str:
        """Generate cache key from prompt and model"""
        key_string = f"{prompt}_{model}"
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def get_cached_response(self, cache_key: str) -> Optional[Dict]:
        """Retrieve cached response"""
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.pkl")
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'rb') as f:
                    return pickle.load(f)
            except Exception as e:
                print(f"Cache read error: {e}")
        return None
    
    def cache_response(self, cache_key: str, response: Dict):
        """Cache response to file"""
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.pkl")
        try:
            with open(cache_file, 'wb') as f:
                pickle.dump(response, f)
        except Exception as e:
            print(f"Cache write error: {e}")

class StaticAnalyzer:
    """Advanced static code analysis engine"""
    
    def __init__(self):
        self.rules = {
            "long_methods": self.check_long_methods,
            "complex_conditionals": self.check_complex_conditionals,
            "magic_numbers": self.check_magic_numbers,
            "duplicate_code": self.check_duplicate_code,
            "unused_variables": self.check_unused_variables
        }
    
    def analyze_file(self, file_path: str) -> Dict:
        """Analyze a single file for code smells"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            lines = content.split('\n')
            ast_tree = None
            
            # Try to parse as JavaScript/TypeScript
            try:
                import ast
                # This is a simplified approach - real JS/TS parsing would need esprima or similar
                pass
            except:
                pass
            
            issues = []
            for rule_name, rule_func in self.rules.items():
                rule_issues = rule_func(lines, ast_tree, content)
                issues.extend(rule_issues)
            
            return {
                "file": file_path,
                "issues": issues,
                "complexity": self.calculate_complexity(lines),
                "maintainability": self.calculate_maintainability(issues)
            }
            
        except Exception as e:
            return {
                "file": file_path,
                "issues": [{"type": "analysis_error", "message": str(e), "severity": "low"}],
                "complexity": 0,
                "maintainability": 0
            }
    
    def check_long_methods(self, lines: List[str], ast_tree, content: str) -> List[Dict]:
        """Check for methods longer than 50 lines"""
        issues = []
        method_start = None
        
        for i, line in enumerate(lines):
            # Simple heuristic for method detection
            if any(pattern in line for pattern in ['function ', '=>', 'class ']):
                method_start = i
            elif method_start is not None and ('}' in line or i - method_start > 50):
                if i - method_start > 50:
                    issues.append({
                        "type": "long_method",
                        "line": i + 1,
                        "message": f"Method too long ({i - method_start} lines)",
                        "severity": "medium"
                    })
                method_start = None
        
        return issues
    
    def check_complex_conditionals(self, lines: List[str], ast_tree, content: str) -> List[Dict]:
        """Check for complex conditional statements"""
        issues = []
        
        for i, line in enumerate(lines):
            # Count logical operators in conditionals
            if 'if ' in line or 'while ' in line or 'for ' in line:
                and_count = line.count('&&')
                or_count = line.count('||')
                total_operators = and_count + or_count
                
                if total_operators > 3:
                    issues.append({
                        "type": "complex_conditional",
                        "line": i + 1,
                        "message": f"Complex conditional with {total_operators} logical operators",
                        "severity": "medium" if total_operators > 5 else "low"
                    })
        
        return issues
    
    def check_magic_numbers(self, lines: List[str], ast_tree, content: str) -> List[Dict]:
        """Check for magic numbers"""
        issues = []
        
        for i, line in enumerate(lines):
            # Find numeric literals (excluding 0, 1, 2, 10, 100 which are often acceptable)
            numbers = re.findall(r'[^a-zA-Z_][0-9]{2,}', line)
            magic_numbers = [n for n in numbers if n not in ['0', '1', '2', '10', '100']]
            
            if magic_numbers:
                issues.append({
                    "type": "magic_number",
                    "line": i + 1,
                    "message": f"Magic number: {magic_numbers[0]}",
                    "severity": "low"
                })
        
        return issues
    
    def check_duplicate_code(self, lines: List[str], ast_tree, content: str) -> List[Dict]:
        """Check for duplicated code blocks"""
        issues = []
        seen_lines = {}
        
        for i, line in enumerate(lines):
            stripped_line = line.strip()
            if len(stripped_line) > 20 and stripped_line in seen_lines:
                # Check if it's a significant duplicate
                prev_line = seen_lines[stripped_line]
                if i - prev_line > 10:  # Not adjacent lines
                    issues.append({
                        "type": "duplicate_code",
                        "line": i + 1,
                        "message": f"Potential code duplication (similar to line {prev_line + 1})",
                        "severity": "medium"
                    })
            seen_lines[stripped_line] = i
        
        return issues
    
    def check_unused_variables(self, lines: List[str], ast_tree, content: str) -> List[Dict]:
        """Check for potentially unused variables"""
        issues = []
        declared_vars = []
        used_vars = set()
        
        # Simple variable declaration detection
        for i, line in enumerate(lines):
            # Match var/let/const declarations
            var_matches = re.findall(r'(?:var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)', line)
            declared_vars.extend([(var, i + 1) for var in var_matches])
            
            # Match variable usage (very simplified)
            usage_matches = re.findall(r'[a-zA-Z_$][a-zA-Z0-9_$]*', line)
            used_vars.update(usage_matches)
        
        # Check for declared but potentially unused variables
        for var_name, line_num in declared_vars:
            if var_name not in used_vars and var_name not in ['_', '__filename', '__dirname']:
                issues.append({
                    "type": "unused_variable",
                    "line": line_num,
                    "message": f"Potentially unused variable: {var_name}",
                    "severity": "low"
                })
        
        return issues
    
    def calculate_complexity(self, lines: List[str]) -> int:
        """Calculate cyclomatic complexity"""
        complexity = 1
        for line in lines:
            complexity += line.count('if ') + line.count('else ') 
            complexity += line.count('for ') + line.count('while ')
            complexity += line.count('case ') + line.count('catch ')
        return complexity
    
    def calculate_maintainability(self, issues: List[Dict]) -> float:
        """Calculate maintainability score (0-100)"""
        if not issues:
            return 100.0
        
        # Weighted scoring based on severity
        score = 100.0
        for issue in issues:
            if issue.get("severity") == "high":
                score -= 10
            elif issue.get("severity") == "medium":
                score -= 5
            elif issue.get("severity") == "low":
                score -= 2
        
        return max(0, score)

class ParallelProcessor:
    """Handle parallel processing for better performance"""
    
    def __init__(self, max_workers=4):
        self.max_workers = max_workers
        self.lock = Lock()
        self.results = {}
    
    def process_files_parallel(self, file_paths: List[str], processor_func) -> Dict:
        """Process multiple files in parallel"""
        results = {}
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all tasks
            future_to_file = {
                executor.submit(processor_func, file_path): file_path 
                for file_path in file_paths
            }
            
            # Collect results
            for future in concurrent.futures.as_completed(future_to_file):
                file_path = future_to_file[future]
                try:
                    result = future.result()
                    with self.lock:
                        results[file_path] = result
                except Exception as e:
                    print(f"❌ Error processing {file_path}: {e}")
                    with self.lock:
                        results[file_path] = {"error": str(e)}
        
        return results

# ==================== MAIN ASSISTANT CLASS ====================

class AIAssistant:
    def __init__(self):
        self.API_KEY = "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"
        self.conversation_history = []
        self.config = self.load_config()
        self.session_actions = []  # Track all actions taken
        self.cache_manager = CacheManager()
        self.static_analyzer = StaticAnalyzer()
    
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
    
    def cached_ai_call(self, messages: List[Dict], model: str, max_retries: int = 3) -> Optional[Dict]:
        """AI call with intelligent caching"""
        # Generate cache key from the last user message (most relevant)
        user_messages = [msg for msg in messages if msg["role"] == "user"]
        if user_messages:
            last_user_message = user_messages[-1]["content"]
            cache_key = self.cache_manager.get_cache_key(last_user_message, model)
            
            # Check cache first
            cached_response = self.cache_manager.get_cached_response(cache_key)
            if cached_response:
                print("⚡ Cache hit! Returning cached response...")
                return cached_response
        
        # Make actual API call
        response = self.robust_ai_call(messages, model, max_retries)
        
        # Cache the response if successful
        if response and user_messages:
            self.cache_manager.cache_response(cache_key, response)
        
        return response
    
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
    
    # ==================== CORE FEATURES ====================
    
    def analyze_code(self):
        """Analyze project code"""
        question = input("🤔 What's your question about the code? ")
        context = self.read_project_files_smart()
        
        messages = [
            {"role": "system", "content": "You are a senior React developer analyzing a codebase."},
            {"role": "user", "content": f"Project files:\n{context}\n\nQuestion: {question}"}
        ]
        
        self.add_to_history("user", f"Analysis request: {question}")
        
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        
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
        
        response = self.cached_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
        
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
            response = self.cached_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
            
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
        
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        
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
                
                response = self.cached_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
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
        
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
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
            
            response = self.cached_ai_call(messages, model_id, max_retries=1)  # Single retry for comparison
            
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

    def intelligent_debugging(self):
        """Advanced debugging assistant"""
        print("🐛 Intelligent Debugging Assistant")
        print("=" * 40)
        
        error_type = input("What type of issue? (1) Runtime Error, (2) Build Error, (3) Performance, (4) Other: ")
        
        if error_type == "1":
            error_message = input("Enter error message: ")
            code_context = input("Enter relevant code snippet: ")
            stack_trace = input("Enter stack trace (if available): ")
            
            debug_prompt = f"""
            Debug this React application error:
            
            Error Message: {error_message}
            Code Context: {code_context}
            Stack Trace: {stack_trace}
            
            Provide:
            1. Root cause analysis
            2. Step-by-step fix
            3. Prevention strategies
            4. Common related issues
            """
            
        elif error_type == "2":
            build_error = input("Enter build error message: ")
            debug_prompt = f"""
            Fix this build error in a React/Vite application:
            {build_error}
            
            Consider:
            1. Dependency issues
            2. Configuration problems
            3. Syntax errors
            4. Environment variables
            """
        
        elif error_type == "3":
            performance_issue = input("Describe the performance issue: ")
            debug_prompt = f"""
            Optimize this React application for performance:
            Issue: {performance_issue}
            
            Analyze for:
            1. Rendering bottlenecks
            2. Memory leaks
            3. Unnecessary re-renders
            4. Bundle size issues
            5. Network optimization
            """
        
        else:
            general_issue = input("Describe the issue: ")
            debug_prompt = f"""
            Help debug this React/JavaScript issue:
            {general_issue}
            
            Provide:
            1. Problem identification
            2. Solution approaches
            3. Implementation steps
            4. Testing verification
            """
        
        messages = [
            {"role": "system", "content": "You are an expert React/Vite debugger. Provide practical, actionable solutions with code examples."},
            {"role": "user", "content": debug_prompt}
        ]
        
        print("🤖 Analyzing the issue...")
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        
        if response and response.get("choices"):
            debug_solution = response["choices"][0]["message"]["content"]
            print("\n🔧 Debugging Solution:")
            print("=" * 50)
            print(debug_solution)
            
            save_debug = input("\n💾 Save debugging solution? (y/n): ")
            if save_debug.lower() == 'y':
                debug_filename = f"debug_solution_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
                self.write_to_file(debug_filename, f"# Debugging Solution\n\n{debug_solution}")
                print(f"✅ Solution saved to {debug_filename}")
        else:
            print("❌ Failed to get debugging assistance.")

    def performance_profiling(self):
        """Analyze code for performance bottlenecks"""
        print("⚡ Performance Profiling")
        print("=" * 30)
        
        # Ask if user wants to analyze specific file or entire project
        scope = input("Analyze (1) Specific file or (2) Entire project? ")
        
        issues = []
        
        if scope == "1":
            filename = input("Enter file to analyze: ")
            actual_filename = self.smart_file_finder(filename)
            
            if not actual_filename or not os.path.exists(actual_filename):
                print("❌ File not found!")
                return
            
            files_to_analyze = [actual_filename]
        else:
            # Analyze entire src directory
            files_to_analyze = []
            for root, dirs, files in os.walk("src"):
                for file in files:
                    if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                        files_to_analyze.append(os.path.join(root, file))
            print(f"🔍 Analyzing {len(files_to_analyze)} files...")
        
        # Check for common performance issues
        for file_path in files_to_analyze:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                lines = content.split('\n')
                
                # Check for performance anti-patterns
                for i, line in enumerate(lines):
                    line_num = i + 1
                    
                    # Anonymous functions in render
                    if "map(" in line and "=>" in line and line.count("function") == 0 and ".map" in line:
                        issues.append({
                            "file": file_path,
                            "line": line_num,
                            "issue": "Anonymous function in render (causes re-renders)",
                            "suggestion": "Extract to useCallback or component method",
                            "severity": "High"
                        })
                    
                    # Multiple useState calls
                    if line.strip().startswith("const [") and "useState" in line:
                        # Count useState in the same component/file
                        useState_count = sum(1 for l in lines[max(0, i-50):min(len(lines), i+50)] if "useState(" in l)
                        if useState_count > 5:
                            issues.append({
                                "file": file_path,
                                "line": line_num,
                                "issue": f"Multiple useState calls ({useState_count})",
                                "suggestion": "Consider using useReducer or custom hooks",
                                "severity": "Medium"
                            })
                    
                    # Expensive operations in render
                    if any(op in line for op in ["sort(", "filter(", "map("]) and ".length" in line:
                        issues.append({
                            "file": file_path,
                            "line": line_num,
                            "issue": "Potentially expensive operation in render",
                            "suggestion": "Memoize with useMemo or move to useEffect",
                            "severity": "Medium"
                        })
                    
                    # Console.log in production code
                    if "console.log" in line and not any(ignore in file_path for ignore in ["test", "spec"]):
                        issues.append({
                            "file": file_path,
                            "line": line_num,
                            "issue": "Console.log in production code",
                            "suggestion": "Remove or use proper logging library",
                            "severity": "Low"
                        })
                
                # Check for large files
                if len(lines) > 500:
                    issues.append({
                        "file": file_path,
                        "line": "N/A",
                        "issue": f"Large file ({len(lines)} lines)",
                        "suggestion": "Consider breaking into smaller components",
                        "severity": "Medium"
                    })
                    
            except Exception as e:
                print(f"⚠️  Error analyzing {file_path}: {e}")
        
        # Display results
        if issues:
            print(f"\n⚡ Found {len(issues)} potential performance issues:")
            print("=" * 60)
            
            # Group by severity
            high_issues = [issue for issue in issues if issue["severity"] == "High"]
            medium_issues = [issue for issue in issues if issue["severity"] == "Medium"]
            low_issues = [issue for issue in issues if issue["severity"] == "Low"]
            
            # Display high severity first
            if high_issues:
                print(f"\n🔴 High Priority ({len(high_issues)} issues):")
                for issue in high_issues:
                    print(f"  📁 {issue['file']}:{issue['line']}")
                    print(f"     ❌ {issue['issue']}")
                    print(f"     💡 {issue['suggestion']}")
                    print()
            
            if medium_issues:
                print(f"🟡 Medium Priority ({len(medium_issues)} issues):")
                for issue in medium_issues:
                    print(f"  📁 {issue['file']}:{issue['line']}")
                    print(f"     ⚠️  {issue['issue']}")
                    print(f"     💡 {issue['suggestion']}")
                    print()
            
            if low_issues:
                print(f"🟢 Low Priority ({len(low_issues)} issues):")
                for issue in low_issues:
                    print(f"  📁 {issue['file']}:{issue['line']}")
                    print(f"     ℹ️  {issue['issue']}")
                    print(f"     💡 {issue['suggestion']}")
                    print()
            
            # Ask for AI optimization suggestions
            get_suggestions = input("🤖 Get AI optimization suggestions for these issues? (y/n): ")
            if get_suggestions.lower() == 'y':
                issues_summary = "\n".join([f"- {issue['file']}: {issue['issue']}" for issue in issues[:10]])
                
                messages = [
                    {"role": "system", "content": "You are a React performance optimization expert. Provide specific, actionable optimization strategies."},
                    {"role": "user", "content": f"""
                    Optimize this React application for performance. Here are the issues found:
                    {issues_summary}
                    
                    Provide:
                    1. General optimization strategies
                    2. Specific code examples for each issue type
                    3. Performance monitoring recommendations
                    4. Best practices for React performance
                    """}
                ]
                
                print("🤖 Generating optimization suggestions...")
                response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
                
                if response and response.get("choices"):
                    optimization_guide = response["choices"][0]["message"]["content"]
                    print("\n🚀 Performance Optimization Guide:")
                    print("=" * 50)
                    print(optimization_guide)
                    
                    save_optimization = input("\n💾 Save optimization guide? (y/n): ")
                    if save_optimization.lower() == 'y':
                        opt_filename = f"performance_optimization_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
                        self.write_to_file(opt_filename, f"# Performance Optimization Guide\n\n{optimization_guide}")
                        print(f"✅ Guide saved to {opt_filename}")
        else:
            print("✅ No obvious performance issues found!")
            
            # Still provide general performance tips
            messages = [
                {"role": "system", "content": "You are a React performance expert. Provide general performance optimization tips."},
                {"role": "user", "content": "Provide general React performance optimization tips and best practices."}
            ]
            
            response = self.cached_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
            if response and response.get("choices"):
                tips = response["choices"][0]["message"]["content"]
                print("\n💡 General Performance Tips:")
                print("=" * 30)
                print(tips)

    def comprehensive_testing(self):
        """Generate multiple types of tests for components"""
        print("🧪 Comprehensive Testing Generator")
        print("=" * 40)
        
        filename = input("Enter component file to test: ")
        actual_filename = self.smart_file_finder(filename)
        
        if not actual_filename or not os.path.exists(actual_filename):
            print("❌ Component file not found!")
            return
        
        # Read the component content
        with open(actual_filename, 'r', encoding='utf-8') as f:
            component_content = f.read()
        
        print(f"\n📄 Analyzing component: {actual_filename}")
        
        # Ask what types of tests to generate
        print("\nWhat types of tests do you want to generate?")
        print("1. Unit Tests")
        print("2. Integration Tests") 
        print("3. End-to-End Tests")
        print("4. All Types")
        
        test_choice = input("Select option (1-4): ")
        
        test_types = []
        if test_choice == "1":
            test_types = ["unit"]
        elif test_choice == "2":
            test_types = ["integration"]
        elif test_choice == "3":
            test_types = ["e2e"]
        else:
            test_types = ["unit", "integration", "e2e"]
        
        generated_tests = []
        
        for test_type in test_types:
            print(f"\n🤖 Generating {test_type.title()} Tests...")
            
            if test_type == "unit":
                prompt = f"""
                Generate comprehensive unit tests for this React component using React Testing Library:
                
                Component: {actual_filename}
                Code: {component_content}
                
                Include tests for:
                1. Rendering with default props
                2. Rendering with different prop values
                3. User interactions and event handling
                4. State changes
                5. Edge cases
                6. Error conditions
                7. Accessibility (aria labels, roles)
                
                Use best practices:
                - Test behavior, not implementation
                - Use descriptive test names
                - Mock external dependencies
                - Test async operations properly
                """
                
            elif test_type == "integration":
                prompt = f"""
                Generate integration tests for this React component:
                
                Component: {actual_filename}
                Code: {component_content}
                
                Test the component's interaction with:
                1. Redux/Context state management
                2. API calls and data fetching
                3. Router navigation
                4. Child components
                5. External libraries
                6. Browser APIs
                
                Include:
                - Setup and teardown
                - Mock implementations
                - Test data fixtures
                - Async operation testing
                """
                
            else:  # e2e
                prompt = f"""
                Generate end-to-end test scenarios for this React component:
                
                Component: {actual_filename}
                Code: {component_content}
                
                Create test scenarios for:
                1. User workflows and journeys
                2. Form submissions and validations
                3. Navigation and routing
                4. Data persistence
                5. Error handling
                6. Performance scenarios
                
                Provide:
                - Test case descriptions
                - Setup instructions
                - Expected outcomes
                - Edge case scenarios
                - Performance considerations
                """
            
            messages = [
                {"role": "system", "content": "You are a testing expert. Generate complete, runnable test files with proper imports and best practices."},
                {"role": "user", "content": prompt}
            ]
            
            response = self.cached_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
            
            if response and response.get("choices"):
                test_content = response["choices"][0]["message"]["content"]
                test_content = self.extract_code_from_response(test_content)
                
                if test_content and len(test_content.strip()) > 20:
                    # Generate appropriate filename
                    base_name = os.path.splitext(actual_filename)[0]
                    if test_type == "unit":
                        test_filename = f"{base_name}.test.jsx"
                    elif test_type == "integration":
                        test_filename = f"{base_name}.integration.test.jsx"
                    else:
                        test_filename = f"{base_name}.e2e.test.jsx"
                    
                    # Write the test file
                    success = self.write_to_file(test_filename, test_content)
                    if success:
                        generated_tests.append(test_filename)
                        print(f"✅ {test_type.title()} tests generated: {test_filename}")
                    else:
                        print(f"❌ Failed to generate {test_type} tests")
                else:
                    print(f"❌ No valid {test_type} test content generated")
            else:
                print(f"❌ Failed to get {test_type} test response from AI")
        
        # Generate test documentation
        if generated_tests:
            doc_prompt = f"""
            Create test documentation for these generated tests:
            
            Component: {actual_filename}
            Generated Tests: {', '.join(generated_tests)}
            
            Provide:
            1. Test strategy overview
            2. How to run each test type
            3. Test coverage summary
            4. Best practices for maintaining tests
            5. Troubleshooting common issues
            """
            
            messages = [
                {"role": "system", "content": "You are a technical writer. Create comprehensive test documentation."},
                {"role": "user", "content": doc_prompt}
            ]
            
            response = self.cached_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
            
            if response and response.get("choices"):
                doc_content = response["choices"][0]["message"]["content"]
                doc_filename = f"{os.path.splitext(actual_filename)[0]}.TESTING.md"
                self.write_to_file(doc_filename, f"# Testing Documentation\n\n{doc_content}")
                print(f"✅ Test documentation generated: {doc_filename}")
            
            print(f"\n🎉 Successfully generated {len(generated_tests)} test files!")
            print("Generated files:")
            for test_file in generated_tests:
                print(f"  • {test_file}")
        else:
            print("❌ No tests were successfully generated")

    def project_health_monitoring(self):
        """Comprehensive project health assessment"""
        print("🏥 Project Health Monitoring")
        print("=" * 40)
        
        print("📊 Analyzing project health metrics...")
        
        health_metrics = {}
        
        # 1. Code Quality Assessment
        print("🔍 Assessing code quality...")
        health_metrics["code_quality"] = self.assess_code_quality()
        
        # 2. Test Coverage Assessment
        print("🧪 Assessing test coverage...")
        health_metrics["test_coverage"] = self.assess_test_coverage()
        
        # 3. Dependency Health Assessment
        print("📦 Assessing dependencies...")
        health_metrics["dependencies"] = self.assess_dependencies()
        
        # 4. Performance Indicators Assessment
        print("⚡ Assessing performance indicators...")
        health_metrics["performance"] = self.assess_performance_indicators()
        
        # 5. Documentation Assessment
        print("📚 Assessing documentation...")
        health_metrics["documentation"] = self.assess_documentation()
        
        # 6. Security Assessment
        print("🛡️  Assessing security...")
        health_metrics["security"] = self.assess_security()
        
        # Generate comprehensive health report
        self.generate_health_report(health_metrics)
        
        # Ask for AI recommendations
        get_recommendations = input("\n🤖 Get AI recommendations for improving project health? (y/n): ")
        if get_recommendations.lower() == 'y':
            self.generate_health_recommendations(health_metrics)

    def assess_code_quality(self):
        """Assess code quality metrics"""
        issues = []
        file_count = 0
        todo_count = 0
        large_files = 0
        
        for root, dirs, files in os.walk("src"):
            for file in files:
                if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                    file_count += 1
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        # Check for TODO/FIXME comments
                        if "TODO" in content.upper() or "FIXME" in content.upper():
                            todo_count += content.upper().count("TODO") + content.upper().count("FIXME")
                            issues.append(f"TODO/FIXME found: {file_path}")
                        
                        # Check for very large files
                        if len(content.split('\n')) > 500:
                            large_files += 1
                            issues.append(f"Large file (>500 lines): {file_path}")
                            
                    except Exception as e:
                        issues.append(f"Error reading {file_path}: {e}")
        
        # Calculate score (100 - issues)
        base_score = 100
        score = max(0, base_score - (todo_count * 2) - (large_files * 5))
        
        return {
            "score": score,
            "issues": issues[:10],  # Show first 10 issues
            "total_files": file_count,
            "todos": todo_count,
            "large_files": large_files
        }

    def assess_test_coverage(self):
        """Assess test coverage"""
        test_files = []
        component_files = []
        
        # Find test files
        for root, dirs, files in os.walk("."):
            for file in files:
                if file.endswith(('.test.js', '.test.jsx', '.spec.js', '.spec.jsx')):
                    test_files.append(os.path.join(root, file))
                elif file.endswith(('.jsx', '.js')) and "src" in root and not file.endswith(('.test.js', '.test.jsx', '.spec.js', '.spec.jsx')):
                    component_files.append(os.path.join(root, file))
        
        # Calculate coverage ratio
        if component_files:
            coverage_ratio = len(test_files) / len(component_files)
            score = min(100, int(coverage_ratio * 100))
        else:
            score = 0
        
        return {
            "score": score,
            "test_files": len(test_files),
            "component_files": len(component_files),
            "coverage_ratio": f"{coverage_ratio:.2%}" if component_files else "0%"
        }

    def assess_dependencies(self):
        """Assess dependency health"""
        issues = []
        score = 100
        
        if os.path.exists("package.json"):
            try:
                with open("package.json", 'r') as f:
                    package_data = json.load(f)
                
                deps = package_data.get("dependencies", {})
                dev_deps = package_data.get("devDependencies", {})
                
                # Check for potentially problematic dependencies
                heavy_deps = ["lodash", "moment", "rxjs", "three", "d3"]
                found_heavy = [dep for dep in deps.keys() if any(heavy in dep.lower() for heavy in heavy_deps)]
                
                if found_heavy:
                    issues.extend([f"Heavy dependency: {dep}" for dep in found_heavy])
                    score -= len(found_heavy) * 5
                
                # Check total dependency count
                total_deps = len(deps) + len(dev_deps)
                if total_deps > 50:
                    issues.append(f"High dependency count: {total_deps}")
                    score -= min(30, (total_deps - 50))
                
                return {
                    "score": max(0, score),
                    "total_dependencies": total_deps,
                    "issues": issues,
                    "heavy_dependencies": found_heavy
                }
            except Exception as e:
                return {
                    "score": 50,
                    "issues": [f"Error reading package.json: {e}"]
                }
        else:
            return {
                "score": 70,
                "issues": ["No package.json found"]
            }

    def assess_performance_indicators(self):
        """Assess performance indicators"""
        issues = []
        score = 100
        
        # Check for common performance anti-patterns
        for root, dirs, files in os.walk("src"):
            for file in files:
                if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        lines = content.split('\n')
                        
                        # Check for anonymous functions in render
                        anonymous_functions = sum(1 for line in lines if "map(" in line and "=>" in line and ".map" in line)
                        if anonymous_functions > 5:
                            issues.append({
                                "file": file_path,
                                "line": line_num,
                                "issue": "Many anonymous functions in render",
                                "suggestion": "Extract to useCallback or component method",
                                "severity": "High"
                            })
                        
                        # Check for console.log statements
                        console_logs = content.count("console.log")
                        if console_logs > 3:
                            issues.append({
                                "file": file_path,
                                "line": line_num,
                                "issue": "Many console.log statements",
                                "suggestion": "Remove or use proper logging library",
                                "severity": "Low"
                            })
                            
                    except Exception as e:
                        issues.append(f"Error analyzing {file_path}: {e}")
        
        return {
            "score": max(0, score),
            "issues": issues[:5],  # Show first 5 issues
            "total_issues_found": len(issues)
        }

    def assess_documentation(self):
        """Assess documentation quality"""
        doc_files = []
        readme_exists = os.path.exists("README.md")
        
        for root, dirs, files in os.walk("."):
            for file in files:
                if file.lower().endswith(('.md', '.txt')) and "readme" in file.lower():
                    doc_files.append(os.path.join(root, file))
                elif file.endswith(('.md', '.txt')) and any(keyword in file.lower() for keyword in ['doc', 'guide', 'manual']):
                    doc_files.append(os.path.join(root, file))
        
        # Calculate score based on documentation presence
        base_score = 30  # Base score for having README
        if readme_exists:
            base_score += 30
        doc_score = min(100, base_score + (len(doc_files) * 10))
        
        return {
            "score": doc_score,
            "readme_exists": readme_exists,
            "documentation_files": len(doc_files),
            "doc_file_list": [os.path.basename(f) for f in doc_files[:5]]
        }

    def assess_security(self):
        """Assess basic security indicators"""
        issues = []
        score = 100
        
        # Check for .env files
        env_files = [f for f in os.listdir(".") if f.startswith(".env")]
        if not env_files:
            issues.append("No .env file found for environment variables")
            score -= 10
        
        # Check package.json for security-related scripts
        if os.path.exists("package.json"):
            try:
                with open("package.json", 'r') as f:
                    package_data = json.load(f)
                
                scripts = package_data.get("scripts", {})
                security_scripts = [name for name in scripts.keys() if any(word in name.lower() for word in ["audit", "security", "scan"])]
                
                if not security_scripts:
                    issues.append("No security audit scripts found")
                    score -= 15
                else:
                    score += 10  # Bonus for having security scripts
                    
            except Exception as e:
                issues.append(f"Error reading package.json for security check: {e}")
                score -= 20
        
        return {
            "score": max(0, min(100, score)),
            "issues": issues,
            "env_files": len(env_files)
        }

    def generate_health_report(self, metrics):
        """Generate comprehensive health report"""
        print("\n📋 Project Health Report:")
        print("=" * 60)
        
        categories = [
            ("Code Quality", "code_quality"),
            ("Test Coverage", "test_coverage"),
            ("Dependencies", "dependencies"),
            ("Performance", "performance"),
            ("Documentation", "documentation"),
            ("Security", "security")
        ]
        
        total_score = 0
        category_count = 0
        
        for category_name, metric_key in categories:
            data = metrics.get(metric_key, {})
            score = data.get("score", 0)
            total_score += score
            category_count += 1
            
            # Determine status emoji
            status = "🟢 Excellent" if score >= 80 else "🟡 Good" if score >= 60 else "🟠 Fair" if score >= 40 else "🔴 Poor"
            
            print(f"\n{category_name}: {score}/100 {status}")
            
            # Show details for each category
            if metric_key == "code_quality":
                print(f"  Files: {data.get('total_files', 0)}")
                print(f"  TODOs: {data.get('todos', 0)}")
                print(f"  Large files: {data.get('large_files', 0)}")
            elif metric_key == "test_coverage":
                print(f"  Test files: {data.get('test_files', 0)}")
                print(f"  Component files: {data.get('component_files', 0)}")
                print(f"  Coverage: {data.get('coverage_ratio', '0%')}")
            elif metric_key == "dependencies":
                print(f"  Total dependencies: {data.get('total_dependencies', 0)}")
                heavy_deps = data.get('heavy_dependencies', [])
                if heavy_deps:
                    print(f"  Heavy dependencies: {', '.join(heavy_deps)}")
            elif metric_key == "documentation":
                print(f"  README exists: {'Yes' if data.get('readme_exists', False) else 'No'}")
                print(f"  Documentation files: {data.get('documentation_files', 0)}")
            elif metric_key == "security":
                print(f"  Environment files: {data.get('env_files', 0)}")
            
            # Show issues if any
            issues = data.get("issues", [])
            if issues:
                print(f"  Issues found: {len(issues)}")
                for issue in issues[:3]:  # Show first 3 issues
                    print(f"    • {issue}")
                if len(issues) > 3:
                    print(f"    ... and {len(issues) - 3} more")
        
        # Overall health score
        overall_score = int(total_score / category_count) if category_count > 0 else 0
        overall_status = "🟢 Excellent" if overall_score >= 80 else "🟡 Good" if overall_score >= 60 else "🟠 Fair" if overall_score >= 40 else "🔴 Poor"
        
        print(f"\n🎯 Overall Health Score: {overall_score}/100 {overall_status}")
        
        # Save report
        save_report = input("\n💾 Save health report? (y/n): ")
        if save_report.lower() == 'y':
            report_content = f"# Project Health Report\n\nGenerated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
            report_content += f"## Overall Score: {overall_score}/100\n\n"
            
            for category_name, metric_key in categories:
                data = metrics.get(metric_key, {})
                score = data.get("score", 0)
                status = "🟢 Excellent" if score >= 80 else "🟡 Good" if score >= 60 else "🟠 Fair" if score >= 40 else "🔴 Poor"
                report_content += f"### {category_name}: {score}/100 {status}\n"
                
                # Add details
                if metric_key == "code_quality":
                    report_content += f"- Files: {data.get('total_files', 0)}\n"
                    report_content += f"- TODOs: {data.get('todos', 0)}\n"
                    report_content += f"- Large files: {data.get('large_files', 0)}\n"
                elif metric_key == "test_coverage":
                    report_content += f"- Test files: {data.get('test_files', 0)}\n"
                    report_content += f"- Component files: {data.get('component_files', 0)}\n"
                    report_content += f"- Coverage: {data.get('coverage_ratio', '0%')}\n"
                
                issues = data.get("issues", [])
                if issues:
                    report_content += f"- Issues ({len(issues)}):\n"
                    for issue in issues:
                        report_content += f"  - {issue}\n"
                report_content += "\n"
            
            report_filename = f"project_health_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
            self.write_to_file(report_filename, report_content)
            print(f"✅ Health report saved to {report_filename}")

    def generate_health_recommendations(self, metrics):
        """Generate AI-powered recommendations for improving project health"""
        print("🤖 Generating health improvement recommendations...")
        
        # Prepare metrics summary for AI
        metrics_summary = ""
        for category, data in metrics.items():
            metrics_summary += f"{category}: {data.get('score', 0)}/100\n"
            if data.get("issues"):
                metrics_summary += f"  Issues: {', '.join(data.get('issues', [])[:3])}\n"
        
        messages = [
            {"role": "system", "content": "You are a senior software architect. Provide actionable recommendations to improve project health."},
            {"role": "user", "content": f"""
            Improve this React project's health based on these metrics:
            {metrics_summary}
            
            Provide specific, prioritized recommendations for:
            1. Immediate actions (high impact, low effort)
            2. Short-term improvements (medium impact, medium effort)
            3. Long-term strategic improvements (high impact, high effort)
            
            Focus on:
            - Code quality improvements
            - Test coverage enhancement
            - Dependency optimization
            - Performance optimization
            - Documentation improvement
            - Security hardening
            """}
        ]
        
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        
        if response and response.get("choices"):
            recommendations = response["choices"][0]["message"]["content"]
            print("\n💡 Health Improvement Recommendations:")
            print("=" * 50)
            print(recommendations)
            
            save_recommendations = input("\n💾 Save recommendations? (y/n): ")
            if save_recommendations.lower() == 'y':
                rec_filename = f"health_recommendations_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
                self.write_to_file(rec_filename, f"# Health Improvement Recommendations\n\n{recommendations}")
                print(f"✅ Recommendations saved to {rec_filename}")

    def migration_assistance(self):
        """Help migrate projects to new technologies"""
        print("🚚 Migration Assistance")
        print("=" * 30)
        
        migrations = {
            "1": "React Class Components to Hooks",
            "2": "JavaScript to TypeScript",
            "3": "CSS to Tailwind CSS",
            "4": "Create React App to Vite",
            "5": "Redux to Zustand/Context",
            "6": "Class-based Routing to React Router v6",
            "7": "Custom State Management to Redux Toolkit"
        }
        
        print("Available migrations:")
        for key, value in migrations.items():
            print(f"  {key}. {value}")
        
        choice = input("\nSelect migration type (1-7): ")
        
        if choice not in migrations:
            print("❌ Invalid selection!")
            return
        
        target_migration = migrations[choice]
        print(f"\n🚀 Starting migration: {target_migration}")
        
        # Get specific details about the migration
        project_scope = input("Enter specific files/components to migrate (or 'all' for entire project): ")
        
        if project_scope.lower() == 'all':
            # Analyze entire project for migration
            context = self.read_project_files_smart()
        else:
            # Analyze specific files
            context = ""
            files = project_scope.split(',')
            for file in files:
                file = file.strip()
                actual_file = self.smart_file_finder(file)
                if actual_file and os.path.exists(actual_file):
                    try:
                        with open(actual_file, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            if len(content) < 20000:  # Limit file size
                                context += f"\n=== {actual_file} ===\n{content}\n"
                                print(f"📄 Added: {actual_file}")
                    except Exception as e:
                        print(f"❌ Error reading {actual_file}: {e}")
        
        # Generate migration guide
        messages = [
            {"role": "system", "content": "You are a migration expert. Provide step-by-step migration guides with code examples."},
            {"role": "user", "content": f"""
            Generate a comprehensive migration guide for: {target_migration}
            
            Project context:
            {context}
            
            Provide:
            1. Migration overview and benefits
            2. Step-by-step migration process
            3. Code examples showing before/after
            4. Common pitfalls and how to avoid them
            5. Testing strategies for migrated code
            6. Rollback plan if issues occur
            7. Performance considerations
            """}
        ]
        
        print("🤖 Generating migration guide...")
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        
        if response and response.get("choices"):
            guide = response["choices"][0]["message"]["content"]
            print(f"\n📋 {target_migration} Migration Guide:")
            print("=" * 50)
            print(guide)
            
            # Ask if user wants to perform the migration
            perform_migration = input(f"\n🤖 Perform {target_migration} migration on files? (y/n): ")
            if perform_migration.lower() == 'y':
                self.perform_migration(target_migration, project_scope)
            
            # Save migration guide
            save_guide = input("\n💾 Save migration guide? (y/n): ")
            if save_guide.lower() == 'y':
                guide_filename = f"migration_{target_migration.replace(' ', '_').replace('/', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
                self.write_to_file(guide_filename, f"# {target_migration} Migration Guide\n\n{guide}")
                print(f"✅ Migration guide saved to {guide_filename}")
        else:
            print("❌ Failed to generate migration guide.")

    def perform_migration(self, migration_type: str, scope: str):
        """Perform actual code migration"""
        print(f"\n🔧 Performing {migration_type} migration...")
        
        if scope.lower() == 'all':
            # Get all relevant files
            files_to_migrate = []
            for root, dirs, files in os.walk("src"):
                for file in files:
                    if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.css')):
                        files_to_migrate.append(os.path.join(root, file))
        else:
            # Get specific files
            files_to_migrate = []
            file_names = scope.split(',')
            for file_name in file_names:
                file_name = file_name.strip()
                actual_file = self.smart_file_finder(file_name)
                if actual_file and os.path.exists(actual_file):
                    files_to_migrate.append(actual_file)
        
        print(f"📁 Found {len(files_to_migrate)} files to migrate")
        
        for file_path in files_to_migrate:
            print(f"\n📝 Processing {file_path}...")
            
            try:
                # Create backup
                backup_file = self.backup_file(file_path)
                
                # Read current content
                with open(file_path, 'r', encoding='utf-8') as f:
                    current_content = f.read()
                
                # Generate migration prompt based on type
                migration_prompt = self.get_migration_prompt(migration_type, file_path, current_content)
                
                messages = [
                    {"role": "system", "content": "You are a senior developer performing code migration. Return only the migrated code."},
                    {"role": "user", "content": migration_prompt}
                ]
                
                # Get migrated code
                response = self.cached_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
                
                if response and response.get("choices"):
                    migrated_content = response["choices"][0]["message"]["content"]
                    migrated_content = self.extract_code_from_response(migrated_content)
                    
                    if migrated_content and len(migrated_content.strip()) > 10:
                        # Show diff preview
                        self.preview_changes(file_path, migrated_content)
                        
                        # Confirm migration
                        confirm = input(f"\n✅ Apply migration to {file_path}? (y/n): ")
                        if confirm.lower() == 'y':
                            success = self.write_to_file(file_path, migrated_content)
                            if success:
                                print(f"✅ Successfully migrated {file_path}")
                            else:
                                print(f"❌ Failed to migrate {file_path}")
                        else:
                            print(f"❌ Migration cancelled for {file_path}")
                    else:
                        print(f"❌ No valid migrated content for {file_path}")
                else:
                    print(f"❌ Failed to get migration response for {file_path}")
                    
            except Exception as e:
                print(f"❌ Error migrating {file_path}: {e}")

    def get_migration_prompt(self, migration_type: str, file_path: str, content: str) -> str:
        """Generate specific migration prompt based on type"""
        prompts = {
            "React Class Components to Hooks": f"""
            Migrate this React class component to use functional components with hooks:
            
            File: {file_path}
            Content: {content}
            
            Convert:
            1. Class component to functional component
            2. this.state to useState
            3. Lifecycle methods to useEffect
            4. Class methods to regular functions
            5. this.props to props parameter
            6. Bind methods appropriately
            """,
            
            "JavaScript to TypeScript": f"""
            Convert this JavaScript code to TypeScript:
            
            File: {file_path}
            Content: {content}
            
            Add:
            1. Type annotations for variables and parameters
            2. Interface definitions for objects
            3. Type definitions for function returns
            4. Generic types where appropriate
            5. Remove any type: any if possible
            """,
            
            "CSS to Tailwind CSS": f"""
            Convert this CSS/SCSS to Tailwind CSS classes:
            
            File: {file_path}
            Content: {content}
            
            Replace:
            1. CSS classes with equivalent Tailwind classes
            2. Custom CSS with Tailwind utility classes
            3. Media queries with responsive Tailwind classes
            4. CSS variables with Tailwind configuration
            """,
            
            "Create React App to Vite": f"""
            Update this Create React App code for Vite compatibility:
            
            File: {file_path}
            Content: {content}
            
            Update:
            1. Environment variable usage (VITE_ prefix)
            2. import.meta.env instead of process.env
            3. Module system compatibility
            4. Build configuration references
            """,
            
            "Redux to Zustand/Context": f"""
            Migrate this Redux code to use Zustand or React Context:
            
            File: {file_path}
            Content: {content}
            
            Convert:
            1. Redux actions to regular functions
            2. Redux reducers to Zustand stores or context providers
            3. mapStateToProps to custom hooks
            4. useDispatch to custom setter functions
            """,
            
            "Class-based Routing to React Router v6": f"""
            Migrate this React Router v5 class-based routing to v6 hooks:
            
            File: {file_path}
            Content: {content}
            
            Convert:
            1. <Switch> to <Routes>
            2. <Route exact> to <Route element>
            3. useHistory to useNavigate
            4. useParams to useParams hook
            5. withRouter HOC to hooks
            """,
            
            "Custom State Management to Redux Toolkit": f"""
            Migrate this custom state management to Redux Toolkit:
            
            File: {file_path}
            Content: {content}
            
            Convert:
            1. Custom context/reducers to RTK slices
            2. Manual dispatch to RTK dispatch
            3. Custom selectors to RTK selectors
            4. Async logic to RTK createAsyncThunk
            """
        }
        
        return prompts.get(migration_type, f"Perform migration: {migration_type} on {file_path}")

    def code_smell_detector(self):
        """Advanced code smell detection"""
        print("👃 Detecting Code Smells...")
        
        smells = []
        for root, dirs, files in os.walk("src"):
            for file in files:
                if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            lines = content.split('\n')
                        
                        # Detect various code smells
                        for i, line in enumerate(lines):
                            line_num = i + 1
                            
                            # Long method detection
                            if len(line) > 120:
                                smells.append({
                                    "file": file_path,
                                    "line": line_num,
                                    "smell": "Long line (>120 characters)",
                                    "severity": "Low"
                                })
                            
                            # Magic numbers
                            import re
                            magic_numbers = re.findall(r'[^a-zA-Z_][0-9]{2,}', line)
                            if magic_numbers and not any(n in ['0', '1', '2', '10', '100'] for n in magic_numbers):
                                smells.append({
                                    "file": file_path,
                                    "line": line_num,
                                    "smell": f"Magic number: {magic_numbers[0]}",
                                    "severity": "Medium"
                                })
                            
                            # Nested callbacks (callback hell)
                            if line.count('=>') > 3 or line.count('function') > 2:
                                smells.append({
                                    "file": file_path,
                                    "line": line_num,
                                    "smell": "Deeply nested callbacks",
                                    "severity": "High"
                                })
                            
                            # Duplicated code blocks
                            if line.strip() in [l.strip() for l in lines[:i]] and len(line.strip()) > 20:
                                smells.append({
                                    "file": file_path,
                                    "line": line_num,
                                    "smell": "Potential code duplication",
                                    "severity": "Medium"
                                })
                    
                    except Exception as e:
                        smells.append({
                            "file": file_path,
                            "line": "N/A",
                            "smell": f"Error analyzing file: {e}",
                            "severity": "Low"
                        })
        
        # Display results
        if smells:
            print(f"\nFound {len(smells)} code smells:")
            print("=" * 40)
            
            # Group by severity
            high_smells = [s for s in smells if s["severity"] == "High"]
            medium_smells = [s for s in smells if s["severity"] == "Medium"]
            low_smells = [s for s in smells if s["severity"] == "Low"]
            
            if high_smells:
                print(f"\n🔴 High Priority ({len(high_smells)}):")
                for smell in high_smells[:5]:
                    print(f"  📁 {smell['file']}:{smell['line']}")
                    print(f"     ❌ {smell['smell']}")
            
            if medium_smells:
                print(f"\n🟡 Medium Priority ({len(medium_smells)}):")
                for smell in medium_smells[:5]:
                    print(f"  📁 {smell['file']}:{smell['line']}")
                    print(f"     ⚠️  {smell['smell']}")
            
            if low_smells:
                print(f"\n🟢 Low Priority ({len(low_smells)}):")
                for smell in low_smells[:5]:
                    print(f"  📁 {smell['file']}:{smell['line']}")
                    print(f"     ℹ️  {smell['smell']}")
        else:
            print("✅ No significant code smells detected!")

    def dependency_graph_analyzer(self):
        """Analyze and visualize dependency relationships"""
        print("🔗 Analyzing Dependency Graph...")
        
        dependencies = {}
        
        # Parse package.json
        if os.path.exists("package.json"):
            try:
                with open("package.json", 'r') as f:
                    package_data = json.load(f)
                
                deps = package_data.get("dependencies", {})
                dev_deps = package_data.get("devDependencies", {})
                
                # Analyze dependency relationships
                for dep_name, version in {**deps, **dev_deps}.items():
                    # Check if dependency is used in code
                    usage_count = 0
                    for root, dirs, files in os.walk("src"):
                        for file in files:
                            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                                file_path = os.path.join(root, file)
                                try:
                                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                                        content = f.read()
                                        if f"from '{dep_name}'" in content or f'require("{dep_name}")' in content:
                                            usage_count += 1
                                except: pass
                    
                    dependencies[dep_name] = {
                        "version": version,
                        "usage_count": usage_count,
                        "is_dev": dep_name in dev_deps
                    }
            
            except Exception as e:
                print(f"❌ Error analyzing dependencies: {e}")
        
        # Display dependency analysis
        if dependencies:
            print(f"\n📊 Dependency Analysis ({len(dependencies)} total):")
            print("=" * 50)
            
            # Sort by usage count
            sorted_deps = sorted(dependencies.items(), key=lambda x: x[1]['usage_count'], reverse=True)
            
            print("Top 10 most used dependencies:")
            for dep_name, info in sorted_deps[:10]:
                usage = "⭐" * min(5, info['usage_count'])  # Star rating
                status = "🛠️  dev" if info['is_dev'] else "📦 prod"
                print(f"  {dep_name} ({info['version']}) - {usage} ({info['usage_count']} usages) {status}")
            
            # Find unused dependencies
            unused_deps = [name for name, info in dependencies.items() if info['usage_count'] == 0]
            if unused_deps:
                print(f"\n⚠️  Potentially unused dependencies ({len(unused_deps)}):")
                for dep in unused_deps[:5]:
                    print(f"  • {dep}")
                if len(unused_deps) > 5:
                    print(f"  ... and {len(unused_deps) - 5} more")
        else:
            print("❌ No dependencies found or error occurred.")

    def code_complexity_analyzer(self):
        """Analyze code complexity metrics"""
        print("🧮 Analyzing Code Complexity...")
        
        complexity_metrics = {
            "total_files": 0,
            "total_lines": 0,
            "avg_lines_per_file": 0,
            "max_lines_in_file": 0,
            "cyclomatic_complexity": 0,
            "nesting_depth": 0
        }
        
        file_complexities = []
        
        for root, dirs, files in os.walk("src"):
            for file in files:
                if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                    file_path = os.path.join(root, file)
                    complexity_metrics["total_files"] += 1
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        lines = content.split('\n')
                        line_count = len(lines)
                        complexity_metrics["total_lines"] += line_count
                        
                        if line_count > complexity_metrics["max_lines_in_file"]:
                            complexity_metrics["max_lines_in_file"] = line_count
                        
                        # Calculate cyclomatic complexity (simplified)
                        cc = content.count('if ') + content.count('else ') + content.count('for ') + content.count('while ')
                        cc += content.count('case ') + content.count('catch ')
                        
                        # Calculate max nesting depth
                        max_depth = 0
                        current_depth = 0
                        for line in lines:
                            if '{' in line:
                                current_depth += 1
                                max_depth = max(max_depth, current_depth)
                            if '}' in line:
                                current_depth = max(0, current_depth - 1)
                        
                        file_complexities.append({
                            "file": file_path,
                            "lines": line_count,
                            "complexity": cc,
                            "depth": max_depth
                        })
                    
                    except Exception as e:
                        print(f"❌ Error analyzing {file_path}: {e}")
        
        # Calculate averages
        if complexity_metrics["total_files"] > 0:
            complexity_metrics["avg_lines_per_file"] = complexity_metrics["total_lines"] / complexity_metrics["total_files"]
        
        # Display results
        print(f"\n📊 Code Complexity Metrics:")
        print("=" * 40)
        print(f"Total Files: {complexity_metrics['total_files']}")
        print(f"Total Lines: {complexity_metrics['total_lines']:,}")
        print(f"Average Lines per File: {complexity_metrics['avg_lines_per_file']:.1f}")
        print(f"Max Lines in Single File: {complexity_metrics['max_lines_in_file']:,}")
        
        # Show most complex files
        if file_complexities:
            print(f"\n📁 Most Complex Files:")
            # Sort by cyclomatic complexity
            sorted_complexity = sorted(file_complexities, key=lambda x: x['complexity'], reverse=True)
            for file_info in sorted_complexity[:5]:
                complexity_rating = "⭐" * min(5, file_info['complexity'] // 10 + 1)
                print(f"  {file_info['file']}")
                print(f"    Lines: {file_info['lines']:,} | Complexity: {file_info['complexity']} {complexity_rating} | Max Depth: {file_info['depth']}")
    
    # ==================== ADVANCED FEATURES ====================
    
    def chain_of_thought_reasoning(self):
        """Use chain-of-thought prompting for complex tasks"""
        print("🧠 Chain-of-Thought Reasoning")
        print("=" * 40)
        
        complex_task = input("Enter complex task for reasoning: ")
        
        messages = [
            {"role": "system", "content": "Think step by step. Break down the problem before providing the solution."},
            {"role": "user", "content": f"Task: {complex_task}\n\nPlease think through this step by step:"}
        ]
        
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        if response:
            reasoning = response["choices"][0]["message"]["content"]
            print("🔍 Reasoning Process:")
            print("=" * 30)
            print(reasoning)
            return reasoning

    def enhanced_code_analysis(self):
        """Enhanced code analysis with static analysis engine"""
        print("🔬 Enhanced Code Analysis")
        print("=" * 35)
        
        filename = input("Enter file to analyze: ")
        actual_filename = self.smart_file_finder(filename)
        
        if not actual_filename or not os.path.exists(actual_filename):
            print("❌ File not found!")
            return
        
        # Traditional AI analysis
        print("🤖 AI-Powered Analysis...")
        with open(actual_filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        messages = [
            {"role": "system", "content": "You are a senior developer performing code review. Analyze for: 1) Best practices 2) Performance 3) Security 4) Maintainability 5) Accessibility"},
            {"role": "user", "content": f"Code to review:\n{content}\n\nProvide specific suggestions with line numbers."}
        ]
        
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        if response:
            ai_analysis = response["choices"][0]["message"]["content"]
            print("\n🤖 AI Analysis Results:")
            print("=" * 30)
            print(ai_analysis)
        
        # Static Analysis Engine
        print("\n⚙️  Static Code Analysis...")
        static_results = self.static_analyzer.analyze_file(actual_filename)
        
        print(f"\n📊 Static Analysis Results:")
        print("=" * 35)
        print(f"File: {static_results['file']}")
        print(f"Complexity: {static_results['complexity']}")
        print(f"Maintainability Score: {static_results['maintainability']:.1f}/100")
        
        if static_results['issues']:
            print(f"\n🚩 Issues Found ({len(static_results['issues'])}):")
            high_issues = [i for i in static_results['issues'] if i.get('severity') == 'high']
            medium_issues = [i for i in static_results['issues'] if i.get('severity') == 'medium']
            low_issues = [i for i in static_results['issues'] if i.get('severity') == 'low']
            
            if high_issues:
                print(f"\n🔴 High Priority ({len(high_issues)}):")
                for issue in high_issues[:3]:
                    print(f"  • Line {issue.get('line', '?')}: {issue.get('message', 'Unknown issue')}")
            
            if medium_issues:
                print(f"\n🟡 Medium Priority ({len(medium_issues)}):")
                for issue in medium_issues[:3]:
                    print(f"  • Line {issue.get('line', '?')}: {issue.get('message', 'Unknown issue')}")
            
            if low_issues:
                print(f"\n🟢 Low Priority ({len(low_issues)}):")
                for issue in low_issues[:3]:
                    print(f"  • Line {issue.get('line', '?')}: {issue.get('message', 'Unknown issue')}")
        else:
            print("✅ No static analysis issues found!")
        
        # Combine both analyses
        combine_analyses = input("\n🤖 Combine both analyses for comprehensive report? (y/n): ")
        if combine_analyses.lower() == 'y':
            self.generate_comprehensive_analysis_report(ai_analysis, static_results)

    def generate_comprehensive_analysis_report(self, ai_analysis: str, static_results: Dict):
        """Generate comprehensive analysis combining AI and static analysis"""
        messages = [
            {"role": "system", "content": "You are a senior software architect. Synthesize multiple analysis reports."},
            {"role": "user", "content": f"""
            Combine these two analyses into a comprehensive report:
            
            AI Analysis:
            {ai_analysis}
            
            Static Analysis Results:
            File: {static_results['file']}
            Complexity: {static_results['complexity']}
            Maintainability: {static_results['maintainability']}/100
            Issues: {static_results['issues']}
            
            Provide:
            1. Executive summary
            2. Priority ranking of issues
            3. Actionable recommendations
            4. Risk assessment
            5. Implementation timeline
            """}
        ]
        
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        if response:
            comprehensive_report = response["choices"][0]["message"]["content"]
            print(f"\n📋 Comprehensive Analysis Report:")
            print("=" * 45)
            print(comprehensive_report)
            
            save_report = input("\n💾 Save comprehensive report? (y/n): ")
            if save_report.lower() == 'y':
                report_filename = f"comprehensive_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
                self.write_to_file(report_filename, f"# Comprehensive Analysis Report\n\n{comprehensive_report}")
                print(f"✅ Report saved to {report_filename}")

    def parallel_file_analysis(self):
        """Analyze multiple files in parallel for better performance"""
        print("⚡ Parallel File Analysis")
        print("=" * 30)
        
        # Find all source files
        source_files = []
        for root, dirs, files in os.walk("src"):
            for file in files:
                if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                    source_files.append(os.path.join(root, file))
        
        if not source_files:
            print("❌ No source files found!")
            return
        
        print(f"Found {len(source_files)} files to analyze...")
        
        # Use parallel processing
        processor = ParallelProcessor()
        results = processor.process_files_parallel(source_files, self.analyze_single_file)
        
        # Aggregate results
        total_issues = 0
        file_issues = {}
        
        for file_path, result in results.items():
            if "issues" in result:
                issue_count = len(result["issues"])
                total_issues += issue_count
                file_issues[file_path] = issue_count
        
        print(f"\n📊 Analysis Results:")
        print("=" * 30)
        print(f"Total issues found: {total_issues}")
        print(f"Files analyzed: {len(results)}")
        
        # Show files with most issues
        sorted_files = sorted(file_issues.items(), key=lambda x: x[1], reverse=True)
        print(f"\n📁 Top 5 files with issues:")
        for file_path, issue_count in sorted_files[:5]:
            print(f"  {file_path}: {issue_count} issues")

    def analyze_single_file(self, file_path: str) -> Dict:
        """Analyze a single file (used by parallel processor)"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            lines = content.split('\n')
            issues = []
            
            # Simple analysis
            for i, line in enumerate(lines):
                if len(line) > 120:  # Long lines
                    issues.append({
                        "type": "long_line",
                        "line": i + 1,
                        "message": "Line too long",
                        "severity": "low"
                    })
                if "TODO" in line.upper():  # TODO comments
                    issues.append({
                        "type": "todo_comment",
                        "line": i + 1,
                        "message": "TODO comment found",
                        "severity": "medium"
                    })
            
            return {
                "file": file_path,
                "issues": issues,
                "line_count": len(lines)
            }
        except Exception as e:
            return {
                "file": file_path,
                "error": str(e),
                "issues": []
            }

    def code_review_assistant(self):
        """AI-powered code review assistant"""
        print("👨‍💻 Code Review Assistant")
        print("=" * 30)
        
        # Get files to review
        files_to_review = []
        while True:
            filename = input("Enter file to review (or 'done'): ")
            if filename.lower() == 'done':
                break
            actual_file = self.smart_file_finder(filename)
            if actual_file and os.path.exists(actual_file):
                files_to_review.append(actual_file)
            else:
                print(f"❌ File not found: {filename}")
        
        if not files_to_review:
            print("❌ No files to review!")
            return
        
        # Perform comprehensive review
        review_results = []
        
        for file_path in files_to_review:
            print(f"\n🔍 Reviewing {file_path}...")
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Multi-aspect review
                review_aspects = [
                    "Code Quality and Best Practices",
                    "Performance Optimization",
                    "Security Considerations", 
                    "Accessibility Compliance",
                    "Maintainability and Readability",
                    "Error Handling and Edge Cases"
                ]
                
                file_reviews = {}
                for aspect in review_aspects:
                    messages = [
                        {"role": "system", "content": f"You are a senior {aspect} expert. Provide detailed, actionable feedback."},
                        {"role": "user", "content": f"""
                        Review this code for {aspect.lower()}:
                        
                        File: {file_path}
                        Code: {content}
                        
                        Provide specific feedback with line numbers and improvement suggestions.
                        """}
                    ]
                    
                    response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
                    if response:
                        file_reviews[aspect] = response["choices"][0]["message"]["content"]
                
                review_results.append({
                    "file": file_path,
                    "reviews": file_reviews
                })
                
            except Exception as e:
                print(f"❌ Error reviewing {file_path}: {e}")
        
        # Generate comprehensive review report
        self.generate_review_report(review_results)

    def generate_review_report(self, review_results):
        """Generate comprehensive code review report"""
        print(f"\n📋 Code Review Report:")
        print("=" * 50)
        
        for result in review_results:
            print(f"\n📁 {result['file']}")
            print("-" * 30)
            
            for aspect, feedback in result['reviews'].items():
                print(f"\n📝 {aspect}:")
                print(feedback[:500] + "..." if len(feedback) > 500 else feedback)
        
        # Save review report
        save_report = input("\n💾 Save review report? (y/n): ")
        if save_report.lower() == 'y':
            report_content = "# Code Review Report\n\n"
            report_content += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
            
            for result in review_results:
                report_content += f"## {result['file']}\n\n"
                for aspect, feedback in result['reviews'].items():
                    report_content += f"### {aspect}\n\n{feedback}\n\n"
            
            report_filename = f"code_review_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
            self.write_to_file(report_filename, report_content)
            print(f"✅ Report saved to {report_filename}")

    def pair_programming_mode(self):
        """Interactive pair programming session"""
        print("👥 Pair Programming Mode")
        print("=" * 30)
        print("Work collaboratively with AI on coding tasks!")
        
        task = input("What would you like to work on? ")
        
        print(f"\n🚀 Starting pair programming session for: {task}")
        print("Commands: 'help', 'code', 'explain', 'debug', 'test', 'quit'")
        
        conversation_context = []
        
        while True:
            command = input("\n👨‍💻 Your command: ").lower().strip()
            
            if command == 'quit':
                print("👋 Ending pair programming session!")
                break
                
            elif command == 'help':
                print("Available commands:")
                print("  help  - Show this help")
                print("  code  - Generate code for the task")
                print("  explain - Explain concepts or code")
                print("  debug - Help debug issues")
                print("  test  - Generate tests")
                print("  quit  - End session")
                
            elif command == 'code':
                prompt = f"Generate code for: {task}"
                messages = [
                    {"role": "system", "content": "You are a pair programming assistant. Generate clean, well-documented code."},
                    {"role": "user", "content": prompt}
                ]
                
                response = self.cached_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
                if response:
                    code = response["choices"][0]["message"]["content"]
                    code = self.extract_code_from_response(code)
                    print(f"\n💻 Generated Code:")
                    print("=" * 30)
                    print(code)
                    conversation_context.append(("code", code))
                    
            elif command == 'explain':
                question = input("What would you like explained? ")
                prompt = f"Explain: {question}\n\nContext: {task}"
                messages = [
                    {"role": "system", "content": "You are a teaching assistant. Provide clear, detailed explanations."},
                    {"role": "user", "content": prompt}
                ]
                
                response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
                if response:
                    explanation = response["choices"][0]["message"]["content"]
                    print(f"\n📘 Explanation:")
                    print("=" * 30)
                    print(explanation)
                    
            elif command == 'debug':
                issue = input("Describe the issue: ")
                code_context = "\n".join([content for cmd, content in conversation_context if cmd == "code"][-1:])
                prompt = f"Debug this issue: {issue}\n\nCode context:\n{code_context}"
                messages = [
                    {"role": "system", "content": "You are a debugging expert. Help identify and fix issues."},
                    {"role": "user", "content": prompt}
                ]
                
                response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
                if response:
                    debug_info = response["choices"][0]["message"]["content"]
                    print(f"\n🐛 Debug Information:")
                    print("=" * 30)
                    print(debug_info)
                    
            elif command == 'test':
                code_context = "\n".join([content for cmd, content in conversation_context if cmd == "code"][-1:])
                prompt = f"Generate tests for this code:\n{code_context}"
                messages = [
                    {"role": "system", "content": "You are a testing expert. Generate comprehensive tests."},
                    {"role": "user", "content": prompt}
                ]
                
                response = self.cached_ai_call(messages, "mistralai/mistral-7b-instruct:nitro")
                if response:
                    tests = response["choices"][0]["message"]["content"]
                    tests = self.extract_code_from_response(tests)
                    print(f"\n🧪 Generated Tests:")
                    print("=" * 30)
                    print(tests)
                    
            else:
                print("❓ Unknown command. Type 'help' for available commands.")

    def knowledge_base_builder(self):
        """Build and maintain project knowledge base"""
        print("📚 Knowledge Base Builder")
        print("=" * 30)
        
        # Find documentation files
        docs = []
        for root, dirs, files in os.walk("."):
            for file in files:
                if file.lower().endswith(('.md', '.txt', '.rst')) and not file.startswith('.'):
                    file_path = os.path.join(root, file)
                    docs.append(file_path)
        
        print(f"Found {len(docs)} documentation files")
        
        # Build knowledge base
        kb_content = ""
        for doc_path in docs[:10]:  # Limit to first 10 docs
            try:
                with open(doc_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    kb_content += f"\n=== {doc_path} ===\n{content}\n"
                    print(f"📄 Added: {doc_path}")
            except Exception as e:
                print(f"❌ Error reading {doc_path}: {e}")
        
        # Save knowledge base
        kb_filename = f"knowledge_base_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        self.write_to_file(kb_filename, kb_content)
        print(f"✅ Knowledge base saved to {kb_filename}")
        
        # Generate knowledge base summary
        messages = [
            {"role": "system", "content": "You are a technical documentation expert. Summarize and organize knowledge."},
            {"role": "user", "content": f"""
            Organize this project knowledge base:
            {kb_content[:10000]}...
            
            Provide:
            1. Key concepts and terminology
            2. Architecture overview
            3. Development guidelines
            4. Best practices
            5. Common patterns and anti-patterns
            """}
        ]
        
        response = self.cached_ai_call(messages, "meta-llama/llama-3-70b-instruct:nitro")
        if response:
            summary = response["choices"][0]["message"]["content"]
            print(f"\n📋 Knowledge Base Summary:")
            print("=" * 40)
            print(summary)
            
            save_summary = input("\n💾 Save knowledge base summary? (y/n): ")
            if save_summary.lower() == 'y':
                summary_filename = f"knowledge_base_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
                self.write_to_file(summary_filename, f"# Knowledge Base Summary\n\n{summary}")
                print(f"✅ Summary saved to {summary_filename}")

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
        """Enhanced menu system with advanced features"""
        print("\n" + "="*80)
        print("🤖 Enhanced AI Coding Assistant v5.0 (Advanced Features)")
        print("="*80)
        print("1.  🔍 Code Analysis     - Analyze and understand your code")
        print("2.  🚀 Code Generation   - Create new components and files")
        print("3.  🛠️  File Modification - Update existing files")
        print("4.  📊 Project Analysis  - Comprehensive project overview")
        print("5.  📁 Batch Operations  - Modify multiple files at once")
        print("6.  🎯 Code Quality      - Analyze code quality and best practices")
        print("7.  🏗️  Project Structure - Show project directory structure")
        print("8.  🤖 Model Comparison  - Compare AI models responses")
        print("9.  🐛 Intelligent Debugging - Advanced error analysis")
        print("10. ⚡ Performance Profiling - Identify code bottlenecks")
        print("11. 🧪 Comprehensive Testing - Generate multiple test types")
        print("12. 🏥 Project Health Monitoring - Overall quality assessment")
        print("13. 🚚 Migration Assistance - Help modernize legacy code")
        print("14. 👃 Code Smell Detection - Find potential issues")
        print("15. 🔗 Dependency Analysis - Analyze project dependencies")
        print("16. 🧮 Code Complexity - Analyze code complexity metrics")
        print("17. 👨‍💻 Code Review Assij'a' stant - Multi-aspect code review")
        print("18. 👥 Pair Programming - Interactive coding session")
        print("19. 📚 Knowledge Base - Build project documentation")
        print("20. 🧠 Chain-of-Thought Reasoning - Advanced problem solving")
        print("21. 🔬 Enhanced Code Analysis - AI + Static analysis")
        print("22. ⚡ Parallel File Analysis - Fast multi-file processing")
        print("23. 💾 Export Session    - Save your work session")
        print("24. 🚪 Exit")
        print("="*80)
    
    def run(self):
        """Main assistant loop"""
        print("🚀 Starting Enhanced AI Coding Assistant v5.0...")
        print(f"📚 Config loaded: {len(self.config)} settings")
        
        while True:
            self.enhanced_menu()
            choice = input("\nSelect option (1-24): ").strip()
            
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
                self.intelligent_debugging()
            elif choice == '10':
                self.performance_profiling()
            elif choice == '11':
                self.comprehensive_testing()
            elif choice == '12':
                self.project_health_monitoring()
            elif choice == '13':
                self.migration_assistance()
            elif choice == '14':
                self.code_smell_detector()
            elif choice == '15':
                self.dependency_graph_analyzer()
            elif choice == '16':
                self.code_complexity_analyzer()
            elif choice == '17':
                self.code_review_assistant()
            elif choice == '18':
                self.pair_programming_mode()
            elif choice == '19':
                self.knowledge_base_builder()
            elif choice == '20':
                self.chain_of_thought_reasoning()
            elif choice == '21':
                self.enhanced_code_analysis()
            elif choice == '22':
                self.parallel_file_analysis()
            elif choice == '23':
                self.export_session()
            elif choice == '24':
                print("👋 Goodbye! Thanks for using AI Coding Assistant!")
                break
            else:
                print("❌ Invalid option. Please try again.")
            
            input("\nPress Enter to continue...")

# Run the enhanced assistant
if __name__ == "__main__":
    assistant = AIAssistant()
    assistant.run()