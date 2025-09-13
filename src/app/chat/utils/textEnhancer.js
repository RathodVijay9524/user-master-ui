// Simple Text Enhancer - Adds intelligent icons before words

export const WORD_ICON_MAPPINGS = {
  // Success and positive words
  'working': '✅',
  'success': '✅',
  'completed': '✅',
  'done': '✅',
  'fixed': '✅',
  'resolved': '✅',
  'available': '✅',
  'ready': '✅',
  'enabled': '✅',
  'active': '✅',
  
  // Features and capabilities
  'features': '🚀',
  'capabilities': '🚀',
  'functionality': '🚀',
  'tools': '🛠️',
  'dashboard': '📊',
  'system': '⚙️',
  'platform': '🏗️',
  
  // Information and analysis
  'analysis': '🔍',
  'analyze': '🔍',
  'overview': '📋',
  'summary': '📋',
  'details': '📝',
  'information': 'ℹ️',
  'data': '📊',
  'metrics': '📈',
  
  // Development and code
  'code': '💻',
  'programming': '💻',
  'development': '💻',
  'implementation': '🔧',
  'configuration': '⚙️',
  'setup': '🔧',
  'install': '📦',
  'build': '🏗️',
  
  // Security and quality
  'security': '🔒',
  'secure': '🔒',
  'authentication': '🔐',
  'authorization': '🔐',
  'quality': '⭐',
  'performance': '⚡',
  'optimization': '🚀',
  'optimize': '🚀',
  
  // Errors and issues
  'error': '❌',
  'issue': '⚠️',
  'problem': '⚠️',
  'bug': '🐛',
  'fix': '🔧',
  'debug': '🐛',
  'troubleshoot': '🔍',
  
  // Examples and tutorials
  'example': '💡',
  'examples': '💡',
  'tutorial': '📚',
  'guide': '📖',
  'documentation': '📚',
  'help': '❓',
  'support': '🤝',
  
  // Benefits and advantages
  'benefits': '✨',
  'advantages': '✨',
  'improvements': '📈',
  'enhancement': '✨',
  'upgrade': '⬆️',
  
  // Warnings and important
  'warning': '⚠️',
  'important': '❗',
  'note': '📝',
  'remember': '💭',
  'attention': '👀',
  'caution': '⚠️',
  
  // Testing and validation
  'test': '🧪',
  'testing': '🧪',
  'validation': '✔️',
  'verify': '✔️',
  'check': '✔️',
  
  // Deployment and operations
  'deploy': '🚀',
  'deployment': '🚀',
  'production': '🏭',
  'environment': '🌍',
  
  // Database and storage
  'database': '🗄️',
  'storage': '💾',
  'cache': '⚡',
  'memory': '🧠',
  
  // Network and API
  'api': '🌐',
  'network': '🌐',
  'endpoint': '🔗',
  'connection': '🔗',
  'request': '📤',
  'response': '📥',
  
  // MCP Tools
  'mcp': '🛠️',
  'tools': '🛠️',
  'spring_ai_mcp_client': '🔧',
  'coding_assistant': '💻',
  'fullanalysis': '🔍',
  'overview': '📋',
  'structure': '🏗️',
  'quality': '⭐',
  'performance': '⚡',
  'generatetests': '🧪',
  'dockerize': '🐳',
  'create': '➕',
  'generate': '🎯'
};

// Function to add icons to text content
export const enhanceTextWithIcons = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let enhancedText = text;
  
  // Process each word mapping
  Object.entries(WORD_ICON_MAPPINGS).forEach(([word, icon]) => {
    // Create regex to match the word at the beginning of sentences or after punctuation
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    
    // Replace with icon + word, but avoid double icons
    enhancedText = enhancedText.replace(regex, (match) => {
      // Check if there's already an icon before this word
      const beforeMatch = enhancedText.substring(0, enhancedText.indexOf(match));
      const lastChar = beforeMatch.charAt(beforeMatch.length - 1);
      
      // If there's already an icon or emoji before, don't add another
      if (lastChar.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)) {
        return match;
      }
      
      return `${icon} ${match}`;
    });
  });
  
  return enhancedText;
};

// Function to enhance specific phrases
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
    { pattern: /^arguments:/gmi, icon: '📥' }
  ];

  // Apply header mappings
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

  // Common phrases with icons - only for specific contexts
  const phraseMappings = [
    { pattern: /\b(what's now working|what is working)\b/gi, icon: '🚀' },
    { pattern: /\b(feature list|list of features)\b/gi, icon: '🚀' },
    { pattern: /\b(example list|list of examples)\b/gi, icon: '💡' },
    { pattern: /\b(benefit list|list of benefits)\b/gi, icon: '✨' },
    { pattern: /\b(troubleshooting guide|troubleshooting steps)\b/gi, icon: '🔍' },
    { pattern: /\b(code analysis|project analysis)\b/gi, icon: '🔍' },
    { pattern: /\b(security check|security audit)\b/gi, icon: '🔒' },
    { pattern: /\b(performance test|performance check)\b/gi, icon: '⚡' },
    { pattern: /\b(test suite|test cases)\b/gi, icon: '🧪' },
    { pattern: /\b(deployment guide|deployment steps)\b/gi, icon: '🚀' },
    { pattern: /\b(database schema|database structure)\b/gi, icon: '🗄️' },
    { pattern: /\b(api documentation|api guide)\b/gi, icon: '🌐' },
    { pattern: /\b(authentication system|auth system)\b/gi, icon: '🔐' },
    { pattern: /\b(code quality check|quality audit)\b/gi, icon: '⭐' },
    { pattern: /\b(documentation guide|docs guide)\b/gi, icon: '📚' },
    { pattern: /\b(tutorial guide|learning guide)\b/gi, icon: '📖' },
    { pattern: /\b(error handling guide|error management)\b/gi, icon: '❌' },
    { pattern: /\b(warning message|caution notice)\b/gi, icon: '⚠️' },
    { pattern: /\b(important note|important information)\b/gi, icon: '❗' }
  ];
  
  phraseMappings.forEach(({ pattern, icon }) => {
    enhancedText = enhancedText.replace(pattern, (match) => {
      // Check if there's already an icon before this phrase
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

// Main function to enhance AI response text
export const enhanceAIResponseText = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // First enhance project structures
  let enhancedText = enhanceProjectStructure(text);
  
  // Then enhance phrases and headers
  enhancedText = enhancePhrasesWithIcons(enhancedText);
  enhancedText = enhanceTextWithIcons(enhancedText);
  
  // Clean up any double spaces
  enhancedText = enhancedText.replace(/\s+/g, ' ');
  
  return enhancedText;
};

export default {
  WORD_ICON_MAPPINGS,
  enhanceTextWithIcons,
  enhancePhrasesWithIcons,
  enhanceAIResponseText
};
