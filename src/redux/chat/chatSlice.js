import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '../../app/chat/services/chatApi';

// Initial state
const initialState = {
  messages: [],
  providers: [],
  selectedProvider: 'openai',
  selectedModel: '',
  isLoading: false,
  error: null,
  currentConversationId: `conv-${Date.now()}`,
};

// Async thunks
export const fetchProviders = createAsyncThunk(
  'chat/fetchProviders',
  async (_, { rejectWithValue }) => {
    try {
      const providers = await chatApi.getProviders();
      return providers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch providers');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (request, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const conversationId = request.conversationId || state.chat.currentConversationId;
      
      // Get user ID from auth state
      const userId = state.auth.user?.id || state.auth.user?.userId;
      
      // Map the generic apiKey to the specific provider API key field
      // Only send API key if it's not empty/null to avoid conflicts with backend defaults
      const messageRequest = {
        message: request.message,
        provider: request.provider,
        model: request.model,
        temperature: request.temperature,
        maxTokens: request.maxTokens,
        conversationId,
        userId, // Add userId for session management
        // Map API key to the correct provider field (only if not empty)
        [`${request.provider}ApiKey`]: request.apiKey && request.apiKey.trim() ? request.apiKey : null,
        // Set all other API key fields to null
        openaiApiKey: request.provider === 'openai' && request.apiKey && request.apiKey.trim() ? request.apiKey : null,
        claudeApiKey: request.provider === 'claude' && request.apiKey && request.apiKey.trim() ? request.apiKey : null,
        groqApiKey: request.provider === 'groq' && request.apiKey && request.apiKey.trim() ? request.apiKey : null,
        geminiApiKey: request.provider === 'gemini' && request.apiKey && request.apiKey.trim() ? request.apiKey : null,
        openrouterApiKey: request.provider === 'openrouter' && request.apiKey && request.apiKey.trim() ? request.apiKey : null,
        huggingfaceApiKey: request.provider === 'huggingface' && request.apiKey && request.apiKey.trim() ? request.apiKey : null,
      };

      // Debug logging
      console.log('sendMessage - Request being sent to backend:', messageRequest);
      console.log('sendMessage - User session info:', {
        userId: userId,
        userFromAuth: state.auth.user,
        conversationId: conversationId
      });
      console.log('sendMessage - API Key debug:', {
        provider: request.provider,
        apiKey: request.apiKey ? `${request.apiKey.substring(0, 8)}...` : 'null/empty',
        mappedKey: `${request.provider}ApiKey`,
        mappedValue: messageRequest[`${request.provider}ApiKey`] ? `${messageRequest[`${request.provider}ApiKey`].substring(0, 8)}...` : 'null/empty'
      });

      const response = await chatApi.sendMessage(messageRequest);
      
      // Create assistant response message
      const assistantMessage = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        text: response.response,
        provider: response.provider,
        model: response.model,
        conversationId: response.conversationId,
        timestamp: response.timestamp,
        tokensUsed: response.tokensUsed,
        responseTimeMs: response.responseTimeMs,
        error: response.error,
      };

      return assistantMessage;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const fetchTools = createAsyncThunk(
  'chat/fetchTools',
  async (_, { rejectWithValue }) => {
    try {
      const tools = await chatApi.getTools();
      return tools;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tools');
    }
  }
);

export const fetchRagStatus = createAsyncThunk(
  'chat/fetchRagStatus',
  async (_, { rejectWithValue }) => {
    try {
      const ragStatus = await chatApi.getRagStatus();
      return ragStatus;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch RAG status');
    }
  }
);

// Chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Set selected provider
    setSelectedProvider: (state, action) => {
      state.selectedProvider = action.payload;
      // Reset selected model when provider changes
      state.selectedModel = '';
    },
    
    // Set selected model
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    
    // Clear messages
    clearMessages: (state) => {
      state.messages = [];
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Start new conversation
    startNewConversation: (state) => {
      state.messages = [];
      state.currentConversationId = `conv-${Date.now()}`;
    },
    
    // Add message manually (for testing)
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    
    // Remove message
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    
    // Clear all messages and reset conversation
    clear: (state) => {
      state.messages = [];
      state.error = null;
    },
    
    // Reset conversation ID
    resetConversationId: (state, action) => {
      state.currentConversationId = action.payload || `conv-${Date.now()}`;
    },
    
    // Load conversation messages into main chat
    loadConversationMessages: (state, action) => {
      console.log('🔄 chatSlice.loadConversationMessages - Received payload:', action.payload);
      console.log('📊 chatSlice.loadConversationMessages - Number of messages:', action.payload?.length || 0);
      state.messages = action.payload || [];
      state.currentConversationId = action.payload?.[0]?.conversationId || state.currentConversationId;
      console.log('✅ chatSlice.loadConversationMessages - Updated state:', {
        messagesCount: state.messages.length,
        currentConversationId: state.currentConversationId
      });
    },
    
    // Send chat message (simplified for UI)
    sendChat: (state, action) => {
      // Add user message
      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: action.payload.message,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(userMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch providers
      .addCase(fetchProviders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providers = action.payload;
        // Set default model for first provider if none selected
        if (action.payload.length > 0 && !state.selectedModel) {
          state.selectedModel = action.payload[0].availableModels[0] || '';
        }
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch tools
      .addCase(fetchTools.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTools.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store tools in state if needed
        console.log('Tools fetched:', action.payload);
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch RAG status
      .addCase(fetchRagStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRagStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store RAG status in state if needed
        console.log('RAG status fetched:', action.payload);
      })
      .addCase(fetchRagStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setSelectedProvider,
  setSelectedModel,
  clearMessages,
  clearError,
  startNewConversation,
  addMessage,
  removeMessage,
  clear,
  resetConversationId,
  loadConversationMessages,
  sendChat,
} = chatSlice.actions;

// Export reducer
export default chatSlice.reducer;

// Selectors
export const selectChatState = (state) => state.chat;
export const selectMessages = (state) => state.chat.messages;
export const selectProviders = (state) => state.chat.providers;
export const selectSelectedProvider = (state) => state.chat.selectedProvider;
export const selectSelectedModel = (state) => state.chat.selectedModel;
export const selectIsLoading = (state) => state.chat.isLoading;
export const selectError = (state) => state.chat.error;
export const selectCurrentConversationId = (state) => state.chat.currentConversationId;
