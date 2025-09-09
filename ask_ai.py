import os
import requests

def read_files_and_ask(question, directory="./"):
    # Collect all Python files
    context = ""
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.py', '.js', '.json', '.txt')):  # Add file types you want
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        context += f"\n=== {file_path} ===\n{content}\n"
                        print(f"Added: {file_path}")  # Show what files are being read
                except Exception as e:
                    print(f"Could not read {file_path}: {e}")
    
    # Send to Ollama
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "deepseek-coder:6.7b",  # Your best code model
            "prompt": f"Here are my files:\n{context}\n\nQuestion: {question}",
            "stream": False
        }
    )
    
    return response.json()["response"]

# Example usage:
if __name__ == "__main__":
    question = input("What do you want to ask about your code? ")
    answer = read_files_and_ask(question, "./")  # Current directory
    print("\nAI Response:")
    print(answer)