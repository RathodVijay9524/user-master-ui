import React from 'react';
import { enhanceTextWithCleanMCP } from '../utils/mcpResponseCleaner';

const TextEnhancer = ({ 
  message, 
  themeColors = {} 
}) => {
  // Enhance text with clean MCP formatting and intelligent icons
  return (
    <div className="break-words chat-message">
      {enhanceTextWithCleanMCP(message).split('\n').map((line, index) => {
        // Add extra spacing for list items to make them stand out
        const isListItem = line.trim().startsWith('🔹 ');
        const isHeader = line.trim().match(/^[🤖🚀🏗️💻🔍🧪⚙️📊🔧💡🎯📋🛠️]/) && line.includes('**');
        return (
          <div key={index} className={`${isListItem ? "mb-2" : isHeader ? "mb-3" : "mb-1"} ${isHeader ? "font-semibold" : ""}`}>
            {line}
          </div>
        );
      })}
    </div>
  );
};

export default TextEnhancer;
