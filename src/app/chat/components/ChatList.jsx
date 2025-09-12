import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserChats, fetchConversationMessages, setCurrentConversation } from '../../../redux/chat/chatListSlice';
import { resetConversationId } from '../../../redux/chat/chatSlice';

const ChatList = ({ onConversationSelect, theme }) => {
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

  // Debug logging
  console.log('ChatList - Current state:', { conversations, isLoading, error, user });

  const handleConversationClick = async (conversation) => {
    try {
      const userId = user.id || user.userId;
      
      // Fetch messages for this conversation
      await dispatch(fetchConversationMessages({ 
        userId, 
        conversationId: conversation.conversationId 
      })).unwrap();
      
      // Set as current conversation
      dispatch(setCurrentConversation(conversation));
      
      // Update chat slice with the conversation ID
      dispatch(resetConversationId(conversation.conversationId));
      
      // Notify parent component
      if (onConversationSelect) {
        onConversationSelect(conversation);
      }
      
      setExpandedConversation(conversation.conversationId);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
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

  return (
    <div className="space-y-2">
      <div className="px-3 py-2 border-b" style={{ borderColor: theme?.border || '#e5e7eb' }}>
        <h3 className="text-sm font-semibold" style={{ color: theme?.text || '#1f2937' }}>
          Recent Conversations ({conversations.length})
        </h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto space-y-1">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
              expandedConversation === conversation.conversationId ? 'ring-2' : ''
            }`}
            style={{
              backgroundColor: expandedConversation === conversation.conversationId 
                ? theme?.accent + '20' || '#ff980020'
                : theme?.bubble || '#f8fafc',
              borderColor: expandedConversation === conversation.conversationId 
                ? theme?.accent || '#ff9800'
                : 'transparent',
              border: expandedConversation === conversation.conversationId ? '1px solid' : 'none'
            }}
            onClick={() => handleConversationClick(conversation)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <span className="text-lg">{getProviderIcon(conversation.provider)}</span>
                <div className="flex-1 min-w-0">
                  <div 
                    className="text-sm font-medium truncate"
                    style={{ color: theme?.text || '#1f2937' }}
                    title={conversation.title}
                  >
                    {conversation.title}
                  </div>
                  <div 
                    className="text-xs opacity-75"
                    style={{ color: theme?.text || '#6b7280' }}
                  >
                    {conversation.provider} • {conversation.model}
                  </div>
                </div>
              </div>
              <div className="text-xs opacity-75 ml-2" style={{ color: theme?.text || '#6b7280' }}>
                {formatDate(conversation.updatedAt)}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs opacity-75" style={{ color: theme?.text || '#6b7280' }}>
              <span>{conversation.totalMessages} messages</span>
              <span>{conversation.totalTokens} tokens</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
