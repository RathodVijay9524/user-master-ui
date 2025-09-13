// MCP Response Cleaner - Makes MCP tool responses clean and readable

export const MCP_TOOL_MAPPINGS = {
  'spring_ai_mcp_client_coding_assistant_fullanalysis': '🔍 Complete Code Analysis',
  'spring_ai_mcp_client_coding_assistant_overview': '📋 Project Overview',
  'spring_ai_mcp_client_coding_assistant_structure': '🏗️ Code Structure Analysis',
  'spring_ai_mcp_client_coding_assistant_quality': '⭐ Code Quality Check',
  'spring_ai_mcp_client_coding_assistant_performance': '⚡ Performance Analysis',
  'spring_ai_mcp_client_coding_assistant_generate': '💻 Code Generation',
  'spring_ai_mcp_client_coding_assistant_boilerplate': '📝 Create Boilerplate',
  'spring_ai_mcp_client_coding_assistant_intelligentrefactor': '🔧 Smart Refactoring',
  'spring_ai_mcp_client_coding_assistant_generatetests': '🧪 Generate Tests',
  'spring_ai_mcp_client_coding_assistant_springcontext': '🌱 Spring Context Analysis',
  'spring_ai_mcp_client_coding_assistant_springbestpractices': '📚 Spring Best Practices',
  'spring_ai_mcp_client_coding_assistant_dbschema': '🗄️ Database Schema Analysis',
  'spring_ai_mcp_client_coding_assistant_languages': '🌐 Language Detection',
  'spring_ai_mcp_client_coding_assistant_intelligent': '🤖 AI-Powered Analysis',
  'spring_ai_mcp_client_coding_assistant_apianalyze': '🌐 API Analysis',
  'spring_ai_mcp_client_coding_assistant_memoryanalyze': '🧠 Memory Analysis',
  'spring_ai_mcp_client_coding_assistant_threadanalyze': '🧵 Thread Analysis',
  'spring_ai_mcp_client_coding_assistant_jvmmetrics': '📊 JVM Metrics',
  'spring_ai_mcp_client_coding_assistant_dockerize': '🐳 Docker Setup'
};

// Function to clean MCP tool names in text
export const cleanMCPToolNames = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let cleanedText = text;
  
  // Replace long MCP tool names with user-friendly versions
  Object.entries(MCP_TOOL_MAPPINGS).forEach(([toolName, friendlyName]) => {
    const regex = new RegExp(toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    cleanedText = cleanedText.replace(regex, friendlyName);
  });
  
  return cleanedText;
};

// Function to clean up MCP response formatting
export const cleanMCPResponse = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let cleanedText = text;
  
  // Check if this looks like an MCP tools response
  if (text.includes('spring_ai_mcp_client') || 
      text.toLowerCase().includes('available mcp tools') ||
      text.toLowerCase().includes('list out mcp tool')) {
    
    // Clean tool names
    cleanedText = cleanMCPToolNames(cleanedText);
    
    // Clean up the formatting
    cleanedText = cleanedText
      // Remove excessive icons from tool names
      .replace(/\* 💻 🔍/g, '* 🔍')
      .replace(/\* 💻/g, '* 💻')
      .replace(/\* 🧪 🧪/g, '* 🧪')
      .replace(/\* 📦 📦/g, '* 📦')
      .replace(/\* 📊 🔍/g, '* 📊')
      // Fix double icons in tool names
      .replace(/🔍 ([^🔍]*?) 🔍/g, '🔍 $1')
      .replace(/💻 ([^💻]*?) 💻/g, '💻 $1')
      .replace(/📄 ([^📄]*?) 📄/g, '📄 $1')
      .replace(/📊 ([^📊]*?) 📊/g, '📊 $1')
      .replace(/🧪 ([^🧪]*?) 🧪/g, '🧪 $1')
      .replace(/📦 ([^📦]*?) 📦/g, '📦 $1')
      .replace(/🔧 ([^🔧]*?) 🔧/g, '🔧 $1')
      .replace(/⚡ ([^⚡]*?) ⚡/g, '⚡ $1')
      .replace(/⭐ ([^⭐]*?) ⭐/g, '⭐ $1')
      .replace(/🗄️ ([^🗄️]*?) 🗄️/g, '🗄️ $1')
      .replace(/🌐 ([^🌐]*?) 🌐/g, '🌐 $1')
      // Clean up redundant text
      .replace(/\(e\.g\., /g, '(')
      .replace(/and much more\./g, '')
      .replace(/Please specify your task for more precise assistance\./g, 'Please specify your task for more precise assistance.')
      .replace(/🛠️ Tools used: None/g, '')
      // Ensure each tool is on its own line
      .replace(/\* /g, '\n* ')
      .replace(/\n\n\* /g, '\n* ')
      .replace(/Available MCP Tools:\n/, 'Available MCP Tools:\n')
      // Fix MCP tools in sentences - separate them onto new lines
      .replace(/including `([^`]+)`, `([^`]+)`, and many others/g, 'including:\n* $1\n* $2\n* And many others')
      .replace(/including `([^`]+)`, `([^`]+)`, `([^`]+)`/g, 'including:\n* $1\n* $2\n* $3')
      .replace(/including `([^`]+)` and `([^`]+)`/g, 'including:\n* $1\n* $2')
      .replace(/such as `([^`]+)`, `([^`]+)`/g, 'such as:\n* $1\n* $2')
      .replace(/tools like `([^`]+)`, `([^`]+)`/g, 'tools like:\n* $1\n* $2')
      .replace(/I have access to (\d+) 🛠️ MCP 🛠️ tools, including `([^`]+)`, `([^`]+)`, and many others/g, 
        'I have access to $1 MCP tools, including:\n* $2\n* $3\n* And many others')
      .replace(/including `([^`]+)`, `([^`]+)`, and many others focused on/g, 
        'including:\n* $1\n* $2\n* And many others focused on')
      .replace(/including `([^`]+)`, `([^`]+)`, and many others for/g, 
        'including:\n* $1\n* $2\n* And many others for')
      .replace(/tools, including `([^`]+)`, `([^`]+)`, and/g, 
        'tools, including:\n* $1\n* $2\n* And')
      // Fix sentence continuation after tool lists
      .replace(/\* And many others focused on ([^.]+)\. To/g, '* And many others focused on $1.\n\nTo')
      .replace(/\* And many others for ([^.]+)\. To/g, '* And many others for $1.\n\nTo')
      .replace(/\* And many others ([^.]+)\. To/g, '* And many others $1.\n\nTo')
      .replace(/and many others focused on ([^.]+)\. To/g, 'and many others focused on $1.\n\nTo');
    
    // Format the response better
    if (cleanedText.includes('Available MCP tools:') || cleanedText.includes('These include:')) {
      cleanedText = cleanedText.replace(/These include:/g, 'Available MCP Tools:');
      
      // Add a clean summary at the end
      const toolCount = (cleanedText.match(/🔍|💻|🔧|🧪|📦|📊|🌱|📚|🗄️|🌐|🤖|⚡|⭐|🏗️|📋|📝|🐳|🧠|🧵/g) || []).length;
      if (toolCount > 0) {
        cleanedText += `\n\n📊 Total: ${toolCount} MCP tools available`;
      }
    }
  }
  
  return cleanedText;
};

// Function to enhance text with clean MCP formatting and intelligent icons for all content
export const enhanceTextWithCleanMCP = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // First clean MCP responses if they exist
  let enhancedText = cleanMCPResponse(text);
  
  // Then add intelligent icons to ALL content (headers, topics, words, etc.)
  enhancedText = enhanceTextWithIcons(enhancedText);
  
  return enhancedText;
};

// Import the basic icon enhancement function
import { enhanceTextWithIcons } from './textEnhancer';

export default {
  MCP_TOOL_MAPPINGS,
  cleanMCPToolNames,
  cleanMCPResponse,
  enhanceTextWithCleanMCP
};
