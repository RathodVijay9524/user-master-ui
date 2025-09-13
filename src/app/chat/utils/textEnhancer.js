// Intelligent Text Enhancer - Adds icons to headers and structured content

// Function to add icons to headers and structured content only
export const enhanceTextWithIcons = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // Don't add icons to individual words - only to headers and structured content
  // This prevents the scattered icon problem
  return text;
};

// Function to enhance headers and structured content
export const enhancePhrasesWithIcons = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let enhancedText = text;
  
  // Headers and sections with icons - only for actual headers at start of line
  const headerMappings = [
    { pattern: /^clean structure:/gmi, icon: '🏗️' },
    { pattern: /^structure:/gmi, icon: '🏗️' },
    { pattern: /^organization:/gmi, icon: '🏗️' },
    { pattern: /^what it does:/gmi, icon: '🚀' },
    { pattern: /^how it works:/gmi, icon: '🚀' },
    { pattern: /^functionality:/gmi, icon: '🚀' },
    { pattern: /^features:/gmi, icon: '✨' },
    { pattern: /^capabilities:/gmi, icon: '✨' },
    { pattern: /^available:/gmi, icon: '✨' },
    { pattern: /^implementation:/gmi, icon: '🔧' },
    { pattern: /^setup:/gmi, icon: '🔧' },
    { pattern: /^installation:/gmi, icon: '🔧' },
    { pattern: /^examples:/gmi, icon: '💡' },
    { pattern: /^example:/gmi, icon: '💡' },
    { pattern: /^demo:/gmi, icon: '💡' },
    { pattern: /^benefits:/gmi, icon: '✅' },
    { pattern: /^advantages:/gmi, icon: '✅' },
    { pattern: /^pros:/gmi, icon: '✅' },
    { pattern: /^troubleshooting:/gmi, icon: '🔍' },
    { pattern: /^issues:/gmi, icon: '🔍' },
    { pattern: /^problems:/gmi, icon: '🔍' },
    { pattern: /^analysis:/gmi, icon: '📊' },
    { pattern: /^analyze:/gmi, icon: '📊' },
    { pattern: /^overview:/gmi, icon: '📊' },
    { pattern: /^security:/gmi, icon: '🔒' },
    { pattern: /^authentication:/gmi, icon: '🔒' },
    { pattern: /^auth:/gmi, icon: '🔒' },
    { pattern: /^performance:/gmi, icon: '⚡' },
    { pattern: /^optimization:/gmi, icon: '⚡' },
    { pattern: /^speed:/gmi, icon: '⚡' },
    { pattern: /^testing:/gmi, icon: '🧪' },
    { pattern: /^tests:/gmi, icon: '🧪' },
    { pattern: /^validation:/gmi, icon: '🧪' },
    { pattern: /^deployment:/gmi, icon: '🚀' },
    { pattern: /^deploy:/gmi, icon: '🚀' },
    { pattern: /^production:/gmi, icon: '🚀' },
    { pattern: /^database:/gmi, icon: '🗄️' },
    { pattern: /^data:/gmi, icon: '🗄️' },
    { pattern: /^storage:/gmi, icon: '🗄️' },
    { pattern: /^api:/gmi, icon: '🌐' },
    { pattern: /^endpoints:/gmi, icon: '🌐' },
    { pattern: /^services:/gmi, icon: '🌐' },
    { pattern: /^quality:/gmi, icon: '⭐' },
    { pattern: /^code quality:/gmi, icon: '⭐' },
    { pattern: /^standards:/gmi, icon: '⭐' },
    { pattern: /^documentation:/gmi, icon: '📚' },
    { pattern: /^docs:/gmi, icon: '📚' },
    { pattern: /^guide:/gmi, icon: '📚' },
    { pattern: /^tutorial:/gmi, icon: '📖' },
    { pattern: /^learning:/gmi, icon: '📖' },
    { pattern: /^how to:/gmi, icon: '📖' },
    { pattern: /^error handling:/gmi, icon: '❌' },
    { pattern: /^errors:/gmi, icon: '❌' },
    { pattern: /^debugging:/gmi, icon: '❌' },
    { pattern: /^warning:/gmi, icon: '⚠️' },
    { pattern: /^caution:/gmi, icon: '⚠️' },
    { pattern: /^important:/gmi, icon: '⚠️' },
    { pattern: /^summary:/gmi, icon: '📋' },
    { pattern: /^conclusion:/gmi, icon: '📋' },
    { pattern: /^result:/gmi, icon: '📋' },
    { pattern: /^steps:/gmi, icon: '📝' },
    { pattern: /^procedure:/gmi, icon: '📝' },
    { pattern: /^process:/gmi, icon: '📝' },
    { pattern: /^configuration:/gmi, icon: '⚙️' },
    { pattern: /^config:/gmi, icon: '⚙️' },
    { pattern: /^settings:/gmi, icon: '⚙️' },
    { pattern: /^requirements:/gmi, icon: '📋' },
    { pattern: /^prerequisites:/gmi, icon: '📋' },
    { pattern: /^needs:/gmi, icon: '📋' },
    { pattern: /^results:/gmi, icon: '📤' },
    { pattern: /^output:/gmi, icon: '📤' },
    { pattern: /^response:/gmi, icon: '📤' },
    { pattern: /^input:/gmi, icon: '📥' },
    { pattern: /^parameters:/gmi, icon: '📥' },
    { pattern: /^arguments:/gmi, icon: '📥' },
    // Numbered list patterns (1. 2. 3.)
    { pattern: /^1\.\s+(.+)/gmi, icon: '1️⃣' },
    { pattern: /^2\.\s+(.+)/gmi, icon: '2️⃣' },
    { pattern: /^3\.\s+(.+)/gmi, icon: '3️⃣' },
    { pattern: /^4\.\s+(.+)/gmi, icon: '4️⃣' },
    { pattern: /^5\.\s+(.+)/gmi, icon: '5️⃣' },
    // Common AI response patterns - More comprehensive
    { pattern: /^as an enhanced ai coding assistant/i, icon: '🤖' },
    { pattern: /^i am an ai coding assistant/i, icon: '🤖' },
    { pattern: /^i am an enhanced ai coding assistant/i, icon: '🤖' },
    { pattern: /^as an ai assistant/i, icon: '🤖' },
    { pattern: /^i am an ai assistant/i, icon: '🤖' },
    { pattern: /^here are some of the key ways/i, icon: '🚀' },
    { pattern: /^here are the key ways/i, icon: '🚀' },
    { pattern: /^here are the main areas/i, icon: '🚀' },
    { pattern: /^my capabilities include/i, icon: '🚀' },
    { pattern: /^i can help you in the following ways/i, icon: '🚀' },
    { pattern: /^project setup and scaffolding/i, icon: '🏗️' },
    { pattern: /^project setup/i, icon: '🏗️' },
    { pattern: /^domain modeling and entity creation/i, icon: '📊' },
    { pattern: /^domain modeling/i, icon: '📊' },
    { pattern: /^controller and service layer development/i, icon: '⚙️' },
    { pattern: /^controller and service development/i, icon: '⚙️' },
    { pattern: /^code generation/i, icon: '💻' },
    { pattern: /^code analysis and optimization/i, icon: '🔍' },
    { pattern: /^code analysis/i, icon: '🔍' },
    { pattern: /^testing and quality assurance/i, icon: '🧪' },
    { pattern: /^testing/i, icon: '🧪' },
    { pattern: /^spring boot configuration/i, icon: '⚙️' },
    { pattern: /^configuration/i, icon: '⚙️' },
    { pattern: /^i can help you/i, icon: '💡' },
    { pattern: /^i can create/i, icon: '🔧' },
    { pattern: /^i can generate/i, icon: '🎯' },
    { pattern: /^i can set up/i, icon: '⚙️' }
  ];

  // Apply header mappings - only for headers at start of line
  headerMappings.forEach(({ pattern, icon }) => {
    enhancedText = enhancedText.replace(pattern, (match) => {
      // Check if there's already an icon before this header
      const beforeMatch = enhancedText.substring(0, enhancedText.indexOf(match));
      const lastChar = beforeMatch.charAt(beforeMatch.length - 1);
      
      // If there's already an icon before, don't add another
      if (lastChar.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)) {
        return match;
      }
      
      return `${icon} ${match}`;
    });
  });
  
  return enhancedText;
};

// Function to format tree structures
export const formatTreeStructure = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let enhancedText = text;
  
  // Detect tree-like structures and format them nicely
  const lines = enhancedText.split('\n');
  const formattedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line looks like a tree structure
    if (line.match(/^[├└│├─└─│\s]*[├└]/) || 
        line.match(/^[├└│├─└─│\s]*[a-zA-Z0-9_\-\.\/\\]+/) ||
        line.match(/^[├└│├─└─│\s]*[📁📄]/) ||
        line.includes('├─') || line.includes('└─') || line.includes('│')) {
      
      // Add tree icons and better formatting
      let formattedLine = line
        .replace(/^[├└│├─└─│\s]*├─/, '├─ 📁 ')
        .replace(/^[├└│├─└─│\s]*└─/, '└─ 📁 ')
        .replace(/\.(js|jsx|ts|tsx|py|java|cpp|c|h)$/g, ' 📄')
        .replace(/\.(css|scss|sass|less)$/g, ' 🎨')
        .replace(/\.(json|xml|yaml|yml)$/g, ' ⚙️')
        .replace(/\.(md|txt|log)$/g, ' 📝')
        .replace(/\.(png|jpg|jpeg|gif|svg)$/g, ' 🖼️')
        .replace(/\.(zip|tar|gz)$/g, ' 📦')
        .replace(/\.(pdf)$/g, ' 📄')
        .replace(/\.(exe|dll|so)$/g, ' ⚙️')
        .replace(/\.(sql|db|sqlite)$/g, ' 🗄️')
        .replace(/\.(html|htm)$/g, ' 🌐')
        .replace(/\.(gitignore|gitmodules)$/g, ' 🔧')
        .replace(/package\.json/g, '📦 package.json')
        .replace(/README\.md/g, '📖 README.md')
        .replace(/node_modules/g, '📦 node_modules')
        .replace(/src/g, '📂 src')
        .replace(/public/g, '🌐 public')
        .replace(/assets/g, '🎨 assets')
        .replace(/components/g, '🧩 components')
        .replace(/utils/g, '🛠️ utils')
        .replace(/services/g, '🔧 services')
        .replace(/styles/g, '🎨 styles')
        .replace(/tests?/g, '🧪 test')
        .replace(/config/g, '⚙️ config');
      
      formattedLines.push(formattedLine);
    } else {
      formattedLines.push(line);
    }
  }
  
  return formattedLines.join('\n');
};

// Function to detect and enhance project structure responses
export const enhanceProjectStructure = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let enhancedText = text;
  
  // Check if this is a project structure analysis
  if (text.toLowerCase().includes('project structure') || 
      text.toLowerCase().includes('directory layout') ||
      text.toLowerCase().includes('tree format') ||
      text.includes('├─') || text.includes('└─') ||
      text.includes('C:\\') || text.includes('/') ||
      text.match(/^[a-zA-Z]:\\.*$/m)) {
    
    // Add a header for project structure
    enhancedText = enhancedText.replace(/^(Project Structure|Directory Layout|Tree Format)/gmi, '🌳 Project Structure');
    
    // Format tree structures
    enhancedText = formatTreeStructure(enhancedText);
    
    // Add summary if path is mentioned
    const pathMatch = text.match(/[C-Z]:\\.*|\.\/([^\/\n]+)/);
    if (pathMatch) {
      enhancedText += '\n\n📊 Structure Analysis Complete';
      enhancedText += `\n📁 Project Path: ${pathMatch[0]}`;
      enhancedText += '\n🔍 Use this structure to understand your project organization';
    }
  }
  
  return enhancedText;
};

// Function to add response source footer
export const addResponseSourceFooter = (text, provider = null, model = null) => {
  if (!text || typeof text !== 'string') return text;
  
  // Provider info mapping
  const providerInfo = {
    'gemini': { name: '💎 Gemini Pro', icon: '💎' },
    'ollama': { name: '🦙 Ollama', icon: '🦙' },
    'openai': { name: '🔑 OpenAI GPT-4', icon: '🔑' },
    'openrouter': { name: '🌐 OpenRouter', icon: '🌐' },
    'claude': { name: '🤖 Claude AI', icon: '🤖' },
    'gpt-4': { name: '🔑 GPT-4', icon: '🔑' },
    'gpt-3.5': { name: '🔑 GPT-3.5', icon: '🔑' }
  };
  
  // Get provider display info
  const providerData = providerInfo[provider] || { name: provider || 'AI Assistant', icon: '🤖' };
  
  // Clean up the text before adding footer - remove any trailing line breaks
  let cleanText = text.trim();
  
  // Create simple footer without any lines - just the text
  const footer = `\n\n${providerData.icon} Response generated by ${providerData.name}${model ? ` (${model})` : ''}`;
  
  return cleanText + footer;
};

// Function to detect and enhance structured content patterns
export const enhanceStructuredContent = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let enhancedText = text;
  
  // First, format lists and separate items properly
  enhancedText = formatListsAndItems(enhancedText);
  
  // Detect common AI response patterns and add structure
  const patterns = [
    // AI Assistant introductions - More comprehensive patterns
    { 
      pattern: /I am an AI coding assistant with access to (\d+) MCP tools, including/gi, 
      replacement: '🤖 **AI Assistant:** I have access to $1 MCP tools, including:'
    },
    { 
      pattern: /I am an enhanced AI coding assistant/gi, 
      replacement: '🤖 **Enhanced AI Coding Assistant**'
    },
    { 
      pattern: /As an enhanced AI coding assistant/gi, 
      replacement: '🤖 **Enhanced AI Coding Assistant**'
    },
    { 
      pattern: /I am an AI assistant/gi, 
      replacement: '🤖 **AI Assistant**'
    },
    { 
      pattern: /As an AI assistant/gi, 
      replacement: '🤖 **AI Assistant**'
    },
    // Tool lists - format them as proper lists
    { 
      pattern: /including:\s*([^.]*?)\s*and many others for ([^.]*)/gi, 
      replacement: 'including:\n\n$1\n\n📋 **For:** $2'
    },
    // Here are the key ways/support patterns - More variations
    { 
      pattern: /Here are (?:some of )?(?:the )?key ways I can (?:support you|help you|assist you)/gi, 
      replacement: '🚀 **How I Can Help:**'
    },
    { 
      pattern: /Here are the main areas where I can assist/gi, 
      replacement: '🚀 **How I Can Help:**'
    },
    { 
      pattern: /I can help you in the following ways/gi, 
      replacement: '🚀 **How I Can Help:**'
    },
    { 
      pattern: /My capabilities include/gi, 
      replacement: '🚀 **My Capabilities:**'
    },
    // Project setup and scaffolding - More variations
    { 
      pattern: /(?:Project Setup and Scaffolding|Project setup and scaffolding)/gi, 
      replacement: '🏗️ **Project Setup and Scaffolding**'
    },
    { 
      pattern: /Project setup and scaffolding/gi, 
      replacement: '🏗️ **Project Setup and Scaffolding**'
    },
    // Domain modeling - More variations
    { 
      pattern: /(?:Domain Modeling and Entity Creation|Domain modeling and entity creation)/gi, 
      replacement: '📊 **Domain Modeling and Entity Creation**'
    },
    { 
      pattern: /Domain modeling and entity creation/gi, 
      replacement: '📊 **Domain Modeling and Entity Creation**'
    },
    // Controller and service development - More variations
    { 
      pattern: /(?:Controller and Service Layer Development|Controller and service layer development)/gi, 
      replacement: '⚙️ **Controller and Service Layer Development**'
    },
    { 
      pattern: /Controller and service layer development/gi, 
      replacement: '⚙️ **Controller and Service Layer Development**'
    },
    // Code generation patterns
    { 
      pattern: /Code Generation/gi, 
      replacement: '💻 **Code Generation**'
    },
    { 
      pattern: /Code generation/gi, 
      replacement: '💻 **Code Generation**'
    },
    // Code analysis patterns
    { 
      pattern: /Code Analysis and Optimization/gi, 
      replacement: '🔍 **Code Analysis and Optimization**'
    },
    { 
      pattern: /Code analysis and optimization/gi, 
      replacement: '🔍 **Code Analysis and Optimization**'
    },
    // Testing patterns
    { 
      pattern: /Testing and Quality Assurance/gi, 
      replacement: '🧪 **Testing and Quality Assurance**'
    },
    { 
      pattern: /Testing and quality assurance/gi, 
      replacement: '🧪 **Testing and Quality Assurance**'
    },
    // Configuration patterns
    { 
      pattern: /Spring Boot Configuration/gi, 
      replacement: '⚙️ **Spring Boot Configuration**'
    },
    { 
      pattern: /Spring Boot configuration/gi, 
      replacement: '⚙️ **Spring Boot Configuration**'
    },
    // Tool usage patterns
    { 
      pattern: /I can use the `([^`]+)` tool to ([^.]*)/gi, 
      replacement: '🛠️ **Tool:** `$1`\n\n📋 **Action:** $2'
    },
    // I can help/create patterns - More comprehensive
    { 
      pattern: /I can help you ([^.]*)/gi, 
      replacement: '💡 **I can help you:** $1'
    },
    { 
      pattern: /I can help you with ([^.]*)/gi, 
      replacement: '💡 **I can help you with:** $1'
    },
    { 
      pattern: /I can create ([^.]*)/gi, 
      replacement: '🔧 **I can create:** $1'
    },
    { 
      pattern: /I can generate ([^.]*)/gi, 
      replacement: '🎯 **I can generate:** $1'
    },
    { 
      pattern: /I can set up ([^.]*)/gi, 
      replacement: '⚙️ **I can set up:** $1'
    },
    { 
      pattern: /I can build ([^.]*)/gi, 
      replacement: '🏗️ **I can build:** $1'
    },
    { 
      pattern: /I can develop ([^.]*)/gi, 
      replacement: '💻 **I can develop:** $1'
    },
    { 
      pattern: /I can analyze ([^.]*)/gi, 
      replacement: '🔍 **I can analyze:** $1'
    },
    { 
      pattern: /I can test ([^.]*)/gi, 
      replacement: '🧪 **I can test:** $1'
    },
    { 
      pattern: /I can configure ([^.]*)/gi, 
      replacement: '⚙️ **I can configure:** $1'
    },
    // Analysis results
    { 
      pattern: /The output is a ([^.]*)/gi, 
      replacement: '📊 **Result:** $1'
    },
    // Project structure mentions
    { 
      pattern: /project structure at ([^.]*)/gi, 
      replacement: '🏗️ **Project Structure:** $1'
    },
    // Limitations or notes
    { 
      pattern: /Due to the limitations of ([^.]*)/gi, 
      replacement: '⚠️ **Note:** Due to the limitations of $1'
    },
    // However/But statements
    { 
      pattern: /However, ([^.]*)/gi, 
      replacement: '💡 **However:** $1'
    },
    // Tool provides
    { 
      pattern: /the tool provides ([^.]*)/gi, 
      replacement: '✨ **Tool Capabilities:** $1'
    },
    // I can help with various tasks
    { 
      pattern: /I can help with various tasks such as ([^.]*)/gi, 
      replacement: '💼 **I can help with:** $1'
    },
    // Specify your request
    { 
      pattern: /Specify your request for assistance/gi, 
      replacement: '📝 **Next Steps:** Specify your request for assistance'
    }
  ];
  
  patterns.forEach(({ pattern, replacement }) => {
    enhancedText = enhancedText.replace(pattern, replacement);
  });
  
  return enhancedText;
};

// Function to format lists and separate items properly
export const formatListsAndItems = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let formattedText = text;
  
  // Format tool lists - separate each tool on its own line
  formattedText = formattedText
    // Handle tool lists with "including:" pattern
    .replace(/including:\s*([^.]*?)\s*and many others/g, (match, tools) => {
      // Split tools by common separators and format each
      const toolList = tools
        .split(/,\s*|\s+and\s+/)
        .map(tool => tool.trim())
        .filter(tool => tool.length > 0)
        .map(tool => `🔹 ${tool}`)
        .join('\n');
      
      return `including:\n\n${toolList}\n\n🔹 And many others`;
    })
    // Format bullet points for better readability with attractive icons
    .replace(/\*\s+/g, '🔹 ')
    .replace(/•\s+/g, '🔹 ')
    // Format "I can help with" lists
    .replace(/I can help with ([^.]*)/g, (match, tasks) => {
      const taskList = tasks
        .split(/,\s*and\s+|,\s*/)
        .map(task => task.trim())
        .filter(task => task.length > 0)
        .map(task => `🔹 ${task}`)
        .join('\n');
      
      return `I can help with:\n${taskList}`;
    });
  
  return formattedText;
};

// Main function to enhance AI response text
export const enhanceAIResponseText = (text, provider = null, model = null) => {
  if (!text || typeof text !== 'string') return text;
  
  // First enhance structured content patterns
  let enhancedText = enhanceStructuredContent(text);
  
  // Then enhance project structures
  enhancedText = enhanceProjectStructure(enhancedText);
  
  // Then enhance phrases and headers
  enhancedText = enhancePhrasesWithIcons(enhancedText);
  
  // Clean up any double spaces but preserve line breaks
  enhancedText = enhancedText.replace(/[ \t]+/g, ' ');
  
  // Add response source footer if provider info is available
  if (provider) {
    enhancedText = addResponseSourceFooter(enhancedText, provider, model);
  }
  
  return enhancedText;
};

export default {
  enhanceTextWithIcons,
  enhancePhrasesWithIcons,
  formatTreeStructure,
  enhanceProjectStructure,
  formatListsAndItems,
  addResponseSourceFooter,
  enhanceStructuredContent,
  enhanceAIResponseText
};
