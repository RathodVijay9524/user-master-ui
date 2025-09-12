import React from 'react';
import { useSelector } from 'react-redux';

const ConversationHistory = ({ conversation, theme, onClose }) => {
  const { conversationMessages, isLoadingMessages, currentConversation } = useSelector((state) => state.chatList);
  
  // Use the conversation from props or Redux state
  const activeConversation = conversation || currentConversation;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getProviderIcon = (provider) => {
    const icons = {
      claude: '🤖',
      gemini: '💎',
      groq: '⚡',
      huggingface: '🤗',
      ollama: '🦙',
      openai: '🔑',
      openrouter: '🌐'
    };
    return icons[provider] || '🤖';
  };

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: theme?.accent || '#ff9800' }}></div>
        <span className="ml-2 text-sm" style={{ color: theme?.text || '#1f2937' }}>Loading messages...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: theme?.border || '#e5e7eb' }}>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getProviderIcon(activeConversation?.provider)}</span>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: theme?.text || '#1f2937' }}>
              {activeConversation?.title}
            </h3>
            <div className="text-xs opacity-75" style={{ color: theme?.text || '#6b7280' }}>
              {activeConversation?.provider} • {activeConversation?.model}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-lg hover:scale-110 transition-transform"
          style={{ color: theme?.text || '#6b7280' }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {conversationMessages && conversationMessages.length > 0 ? (
          conversationMessages.map((message, index) => (
            <div key={message.id || index} className="space-y-3">
              {/* User Message */}
              <div className="flex justify-end">
                <div
                  className="max-w-[80%] p-3 rounded-lg"
                  style={{
                    backgroundColor: theme?.userBubble || '#dbeafe',
                    color: theme?.userText || '#1e40af'
                  }}
                >
                  <div className="text-sm">{message.userMessage}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <span className="text-lg mt-1">{getProviderIcon(message.provider)}</span>
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: theme?.aiBubble || '#e2e8f0',
                      color: theme?.aiText || '#1e293b'
                    }}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.aiResponse}</div>
                    <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                      <span>{message.tokensUsed} tokens</span>
                      <span>{message.responseTimeMs}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💬</div>
            <div className="text-sm opacity-75" style={{ color: theme?.text || '#6b7280' }}>
              No messages found in this conversation
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {activeConversation && (
        <div className="p-3 border-t" style={{ borderColor: theme?.border || '#e5e7eb' }}>
          <div className="flex justify-between text-xs opacity-75" style={{ color: theme?.text || '#6b7280' }}>
            <span>{activeConversation.totalMessages} messages</span>
            <span>{activeConversation.totalTokens} tokens</span>
            <span>Updated: {formatTimestamp(activeConversation.updatedAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
