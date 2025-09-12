import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '../../app/chat/services/chatApi';

// Initial state
const initialState = {
  conversations: [],
  currentConversation: null,
  conversationMessages: [],
  chatStats: null,
  isLoading: false,
  isLoadingMessages: false,
  isLoadingStats: false,
  error: null,
};

// Async thunks
export const fetchUserChats = createAsyncThunk(
  'chatList/fetchUserChats',
  async (userId, { rejectWithValue }) => {
    try {
      console.log('chatListSlice.fetchUserChats - Starting request for userId:', userId);
      const response = await chatApi.getUserChats(userId);
      console.log('chatListSlice.fetchUserChats - Success response:', response);
      return response;
    } catch (error) {
      console.error('chatListSlice.fetchUserChats - Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user chats');
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'chatList/fetchConversationMessages',
  async ({ userId, conversationId }, { rejectWithValue }) => {
    try {
      console.log('🔄 chatListSlice.fetchConversationMessages - Starting request:', { userId, conversationId });
      const response = await chatApi.getConversationMessages(userId, conversationId);
      console.log('✅ chatListSlice.fetchConversationMessages - Success response:', response);
      return response;
    } catch (error) {
      console.error('❌ chatListSlice.fetchConversationMessages - Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation messages');
    }
  }
);

export const fetchUserChatStats = createAsyncThunk(
  'chatList/fetchUserChatStats',
  async (userId, { rejectWithValue }) => {
    try {
      console.log('chatListSlice.fetchUserChatStats - Starting request for userId:', userId);
      const response = await chatApi.getUserChatStats(userId);
      console.log('chatListSlice.fetchUserChatStats - Success response:', response);
      return response;
    } catch (error) {
      console.error('chatListSlice.fetchUserChatStats - Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch chat statistics');
    }
  }
);

// Slice
const chatListSlice = createSlice({
  name: 'chatList',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearConversationMessages: (state) => {
      state.conversationMessages = [];
      state.currentConversation = null;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    clearChatStats: (state) => {
      state.chatStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user chats
      .addCase(fetchUserChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('chatListSlice - Received payload:', action.payload);
        // Handle both direct array and wrapped object responses
        state.conversations = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload.conversations || []);
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch conversation messages
      .addCase(fetchConversationMessages.pending, (state) => {
        state.isLoadingMessages = true;
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        console.log('chatListSlice - Received messages payload:', action.payload);
        // Handle both direct array and wrapped object responses
        state.conversationMessages = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload.messages || []);
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload;
      })
      
      // Fetch user chat stats
      .addCase(fetchUserChatStats.pending, (state) => {
        state.isLoadingStats = true;
        state.error = null;
      })
      .addCase(fetchUserChatStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.chatStats = action.payload;
      })
      .addCase(fetchUserChatStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearConversationMessages,
  setCurrentConversation,
  clearChatStats,
} = chatListSlice.actions;

export default chatListSlice.reducer;
