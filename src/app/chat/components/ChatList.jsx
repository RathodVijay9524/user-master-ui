import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserChats, fetchConversationMessages, setCurrentConversation } from '../../../redux/chat/chatListSlice';
import { resetConversationId, loadConversationMessages } from '../../../redux/chat/chatSlice';

const ChatList = ({ onConversationSelect, theme, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { conversations, isLoading, error } = useSelector((state) => state.chatList);
  const [expandedConversation, setExpandedConversation] = useState(null);

  useEffect(() => {
    if (user?.id || user?.userId) {
      const userId = user.id || user.userId;
      console.log('ChatList - Fetching chats for userId:', userId);
      dispatch(fetchUserChats(userId));
    } else {
      console.log('ChatList - No user found:', user);
    }
  }, [dispatch, user]);

  // Debug: Log conversation data to see token values
  useEffect(() => {
    if (conversations.length > 0) {
      console.log('🔍 ChatList - Conversation data:', conversations);
      conversations.forEach((conv, index) => {
        console.log(`📊 Conversation ${index}:`, {
          id: conv.id,
          title: conv.title,
          totalTokens: conv.totalTokens,
          totalTokensUsed: conv.totalTokensUsed,
          tokensUsed: conv.tokensUsed,
          allFields: conv
        });
      });
    }
  }, [conversations]);

  // Debug logging
  console.log('ChatList - Current state:', { conversations, isLoading, error, user });
  
  // Check if we have conversations data
  if (conversations && Array.isArray(conversations) && conversations.length === 0 && !isLoading && !error) {
    console.log('ChatList - No conversations found for user');
  }


  const handleConversationClick = async (conversation) => {
    try {
      const userId = user.id || user.userId;
      
      // Fetch messages for this conversation
      const messagesResponse = await dispatch(fetchConversationMessages({ 
        userId, 
        conversationId: conversation.conversationId 
      })).unwrap();
      
      // Convert conversation messages to chat messages format
      // Each message object contains both userMessage and aiResponse, so we need to create two messages
      const chatMessages = [];
      
      messagesResponse.forEach((msg, index) => {
        // Create user message if userMessage exists
        if (msg.userMessage) {
          const userMessage = {
            id: `msg-user-${msg.id || index}`,
            role: 'user',
            text: msg.userMessage,
            timestamp: msg.timestamp || new Date().toISOString(),
            conversationId: conversation.conversationId,
            provider: conversation.provider,
            model: conversation.model
          };
          chatMessages.push(userMessage);
        }
        
        // Create AI message if aiResponse exists
        if (msg.aiResponse) {
          const aiMessage = {
            id: `msg-ai-${msg.id || index}`,
            role: 'assistant',
            text: msg.aiResponse,
            timestamp: msg.timestamp || new Date().toISOString(),
            conversationId: conversation.conversationId,
            provider: conversation.provider,
            model: conversation.model
          };
          chatMessages.push(aiMessage);
        }
      });
      
      // Load messages into main chat area
      dispatch(loadConversationMessages(chatMessages));
      
      // Set as current conversation
      dispatch(setCurrentConversation(conversation));
      
      // Update chat slice with the conversation ID
      dispatch(resetConversationId(conversation.conversationId));
      
      // Close the chat history modal
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 100);
      
      setExpandedConversation(conversation.conversationId);
    } catch (error) {
      console.error('❌ ChatList - Failed to load conversation:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Unknown';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: theme?.accent || '#ff9800' }}></div>
        <span className="ml-2 text-sm" style={{ color: theme?.text || '#1f2937' }}>Loading conversations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 text-sm mb-2">⚠️ Backend Error</div>
        <div className="text-xs opacity-75" style={{ color: theme?.text || '#6b7280' }}>
          The chat list endpoint returned a server error (500)
        </div>
        <div className="text-xs opacity-50 mt-2" style={{ color: theme?.text || '#6b7280' }}>
          This might be because:
          <br />• Backend returned 500 Internal Server Error
          <br />• Data structure mismatch in response
          <br />• Network connectivity issues
        </div>
        <div className="text-xs opacity-50 mt-2" style={{ color: theme?.text || '#6b7280' }}>
          Try sending a message first to create a conversation
        </div>
        <button
          onClick={() => {
            const userId = user?.id || user?.userId;
            if (userId) {
              dispatch(fetchUserChats(userId));
            }
          }}
          className="mt-3 px-3 py-1 text-xs rounded hover:opacity-80 transition-all duration-200"
          style={{
            backgroundColor: theme?.accent || '#ff9800',
            color: '#ffffff'
          }}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-4xl mb-2">💬</div>
        <div className="text-sm font-medium mb-1" style={{ color: theme?.text || '#1f2937' }}>No conversations yet</div>
        <div className="text-xs opacity-75" style={{ color: theme?.text || '#6b7280' }}>Start a new chat to see your conversations here</div>
      </div>
    );
  }

  const truncateModel = (model) => {
    if (!model) return 'Unknown';
    if (typeof model === 'string' && model.length > 30) {
      return model.substring(0, 30) + '...';
    }
    if (Array.isArray(model)) {
      return model.length > 0 ? model[0] + (model.length > 1 ? ` +${model.length - 1}` : '') : 'Unknown';
    }
    return model;
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header with Search */}
      <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor: theme?.border || '#e5e7eb' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center" style={{ color: theme?.text || '#1f2937' }}>
            <span className="mr-2 text-xl">💬</span>
            Chat History
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            style={{ color: theme?.text || '#6b7280' }}
          >
            ✕
          </button>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pl-10 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{
              backgroundColor: theme?.bubble || '#f8fafc',
              borderColor: theme?.border || '#e5e7eb',
              color: theme?.text || '#1f2937',
              focusRingColor: theme?.accent || '#ff9800'
            }}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm opacity-60" style={{ color: theme?.text || '#6b7280' }}>
            🔍
          </span>
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto space-y-2 px-2 py-2 min-h-0">
        <div className="text-xs font-medium mb-2 px-2 sticky top-0 bg-opacity-90 backdrop-blur-sm" style={{ 
          color: theme?.text || '#6b7280',
          backgroundColor: theme?.main || '#ffffff'
        }}>
          Recent Conversations ({conversations.length})
        </div>
        
        <div className="space-y-1 pb-2">
          {conversations.map((conversation, index) => (
            <div
              key={conversation.id}
              className={`group p-3 rounded-lg cursor-pointer hover-lift animate-slide-in-up ${
                expandedConversation === conversation.conversationId ? 'ring-2 shadow-lg' : ''
              }`}
              style={{
                backgroundColor: expandedConversation === conversation.conversationId 
                  ? theme?.accent + '15' || '#ff980015'
                  : theme?.bubble || '#f8fafc',
                borderColor: expandedConversation === conversation.conversationId 
                  ? theme?.accent || '#ff9800'
                  : 'transparent',
                border: expandedConversation === conversation.conversationId ? '1px solid' : 'none',
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => handleConversationClick(conversation)}
            >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm" style={{ backgroundColor: theme?.accent + '20' || '#ff980020' }}>
                  {getProviderIcon(conversation.provider)}
                </div>
                <div className="flex-1 min-w-0">
                  <div 
                    className="text-sm font-semibold truncate"
                    style={{ color: theme?.text || '#1f2937' }}
                    title={conversation.title}
                  >
                    {conversation.title}
                  </div>
                  <div 
                    className="text-xs opacity-75 truncate"
                    style={{ color: theme?.text || '#6b7280' }}
                    title={`${conversation.provider} • ${conversation.model}`}
                  >
                    {conversation.provider} • {truncateModel(conversation.model)}
                  </div>
                </div>
              </div>
              <div className="text-xs opacity-75 ml-2 text-right" style={{ color: theme?.text || '#6b7280' }}>
                <div className="font-medium">{formatDate(conversation.updatedAt)}</div>
                <div className="opacity-60">{conversation.totalTokens || conversation.totalTokensUsed || conversation.tokensUsed || 0} tokens</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs opacity-75" style={{ color: theme?.text || '#6b7280' }}>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="mr-1">💬</span>
                  {conversation.totalMessages} messages
                </span>
                <span className="flex items-center">
                  <span className="mr-1">⚡</span>
                  {conversation.totalTokens || conversation.totalTokensUsed || conversation.tokensUsed || 0} tokens
                </span>
              </div>
              <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                Click to open →
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
