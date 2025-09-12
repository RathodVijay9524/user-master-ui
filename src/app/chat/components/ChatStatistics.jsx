import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserChatStats } from '../../../redux/chat/chatListSlice';

const ChatStatistics = ({ theme }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatStats, isLoadingStats, error } = useSelector((state) => state.chatList);

  useEffect(() => {
    if (user?.id || user?.userId) {
      const userId = user.id || user.userId;
      console.log('ChatStatistics - Fetching stats for userId:', userId);
      dispatch(fetchUserChatStats(userId));
    } else {
      console.log('ChatStatistics - No user found:', user);
    }
  }, [dispatch, user]);

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: theme?.accent || '#ff9800' }}></div>
        <span className="ml-2 text-sm" style={{ color: theme?.text || '#1f2937' }}>Loading stats...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 text-sm mb-2">⚠️ Backend Error</div>
        <div className="text-xs opacity-75" style={{ color: theme?.text || '#6b7280' }}>
          The chat statistics endpoint returned a server error (500)
        </div>
        <div className="text-xs opacity-50 mt-2" style={{ color: theme?.text || '#6b7280' }}>
          This might be because:
          <br />• Backend returned 500 Internal Server Error
          <br />• Data structure mismatch in response
          <br />• Network connectivity issues
        </div>
        <div className="text-xs opacity-50 mt-2" style={{ color: theme?.text || '#6b7280' }}>
          Try sending a message first to generate statistics
        </div>
        <button
          onClick={() => {
            const userId = user?.id || user?.userId;
            if (userId) {
              dispatch(fetchUserChatStats(userId));
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

  if (!chatStats) {
    return (
      <div className="p-4 text-center">
        <div className="text-4xl mb-2">📊</div>
        <div className="text-sm font-medium mb-1" style={{ color: theme?.text || '#1f2937' }}>No statistics available</div>
        <div className="text-xs opacity-75" style={{ color: theme?.text || '#6b7280' }}>Start chatting to see your usage statistics</div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Messages',
      value: chatStats.totalMessages || 0,
      icon: '💬',
      color: theme?.accent || '#ff9800'
    },
    {
      label: 'Total Tokens',
      value: chatStats.totalTokens || 0,
      icon: '🔢',
      color: theme?.accent || '#ff9800'
    },
    {
      label: 'Active Conversations',
      value: chatStats.activeConversations || 0,
      icon: '💭',
      color: theme?.accent || '#ff9800'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="px-3 py-2 border-b" style={{ borderColor: theme?.border || '#e5e7eb' }}>
        <h3 className="text-sm font-semibold flex items-center" style={{ color: theme?.text || '#1f2937' }}>
          <span className="mr-2">📊</span>
          Chat Statistics
        </h3>
      </div>
      
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: theme?.bubble || '#f8fafc',
              border: `1px solid ${theme?.border || '#e5e7eb'}`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-sm font-medium" style={{ color: theme?.text || '#1f2937' }}>
                  {stat.label}
                </span>
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: stat.color }}
              >
                {stat.value.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="p-3 rounded-lg" style={{ backgroundColor: theme?.bubble || '#f8fafc' }}>
        <div className="text-xs opacity-75 text-center" style={{ color: theme?.text || '#6b7280' }}>
          User ID: {user?.id || user?.userId || 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default ChatStatistics;
