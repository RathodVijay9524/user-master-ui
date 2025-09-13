import React from 'react';
import { enhanceTextWithCleanMCP } from '../utils/mcpResponseCleaner';

const TextEnhancer = ({ 
  message, 
  themeColors = {} 
}) => {
  // Enhance text with clean MCP formatting and intelligent icons
  return (
    <div className="break-words">
      {enhanceTextWithCleanMCP(message).split('\n').map((line, index) => {
        // Add extra spacing for list items to make them stand out
        const isListItem = line.trim().startsWith('* ');
        return (
          <div key={index} className={isListItem ? "mb-2" : "mb-1"}>
            {line}
          </div>
        );
      })}
    </div>
  );
};

export default TextEnhancer;
