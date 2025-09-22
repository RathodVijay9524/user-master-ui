import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '../../app/chat/services/chatApi';
import { enhanceTextWithCleanMCP } from '../../app/chat/utils/mcpResponseCleaner';
import { userChatService } from './userChatService';

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
      
      // Ensure model is a string, not an array - AGGRESSIVE FIX
      let safeModel = request.model;
      console.log('🔍 sendMessage - Raw model received:', safeModel, 'Type:', typeof safeModel, 'IsArray:', Array.isArray(safeModel));
      
      if (Array.isArray(safeModel)) {
        console.error('🚨 CRITICAL: Model is still an array! Taking first element:', safeModel);
        safeModel = safeModel[0] || 'gpt-4';
      }
      if (!safeModel || typeof safeModel !== 'string') {
        console.error('🚨 CRITICAL: Model is invalid! Using default:', safeModel);
        safeModel = 'gpt-4';
      }
      
      console.log('✅ sendMessage - Safe model determined:', safeModel, 'Type:', typeof safeModel);

      // Map the generic apiKey to the specific provider API key field
      // Only send API key if it's not empty/null to avoid conflicts with backend defaults
      const messageRequest = {
        message: request.message,
        provider: request.provider,
        model: safeModel,
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
      console.log('🔍 sendMessage - Request received:', request);
      console.log('🔍 sendMessage - Model details:', {
        model: request.model,
        modelType: typeof request.model,
        modelIsArray: Array.isArray(request.model),
        modelLength: Array.isArray(request.model) ? request.model.length : 'N/A'
      });
      console.log('🔍 sendMessage - Final messageRequest being sent to backend:', messageRequest);
      console.log('🔍 sendMessage - Final model in request:', messageRequest.model, 'Type:', typeof messageRequest.model);
      console.log('🔍 sendMessage - User session info:', {
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
    
    // Load user-specific messages
    loadUserMessages: (state, action) => {
      const { userId } = action.payload;
      if (userId) {
        // Set current user in service
        userChatService.setCurrentUser(userId);
        // Load messages
        const userMessages = userChatService.loadUserChatMessages();
        state.messages = userMessages || [];
        console.log(`📱 Loaded ${state.messages.length} messages for user ${userId}`);
      }
    },
    
    // Save user-specific messages
    saveUserMessages: (state, action) => {
      const { userId } = action.payload;
      if (userId && state.messages.length > 0) {
        // Set current user in service
        userChatService.setCurrentUser(userId);
        // Save messages
        userChatService.saveUserChatMessages(state.messages);
        console.log(`💾 Saved ${state.messages.length} messages for user ${userId}`);
      }
    },
    
    // Clear user-specific messages
    clearUserMessages: (state, action) => {
      const { userId } = action.payload;
      if (userId) {
        // Set current user in service
        userChatService.setCurrentUser(userId);
        // Clear messages
        userChatService.clearUserChatMessages();
        state.messages = [];
        console.log(`🗑️ Cleared messages for user ${userId}`);
      } else {
        // Clear all messages if no userId provided
        state.messages = [];
      }
    },
    
    // Remove message
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    
    // Clear all messages and reset conversation
    clear: (state) => {
      state.messages = [];
      state.error = null;
      state.currentConversationId = `conv-${Date.now()}`;
    },
    
    // Reset conversation ID
    resetConversationId: (state, action) => {
      state.currentConversationId = action.payload || `conv-${Date.now()}`;
    },
    
    // Load conversation messages into main chat
    loadConversationMessages: (state, action) => {
      const messages = action.payload || [];
      
      // Enhance AI messages when loading from history with provider info
      const enhancedMessages = messages.map(msg => {
        if (msg.role === 'assistant' && msg.text) {
          return {
            ...msg,
            text: enhanceTextWithCleanMCP(msg.text, msg.provider, msg.model)
          };
        }
        return msg;
      });
      
      state.messages = enhancedMessages;
      // Don't update currentConversationId when loading from history
      // This allows "New Chat" to create a fresh conversation
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
        
        // Enhance the AI response text before storing it with provider info
        const enhancedMessage = {
          ...action.payload,
          text: enhanceTextWithCleanMCP(action.payload.text, action.payload.provider, action.payload.model)
        };
        
        state.messages.push(enhancedMessage);
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
  loadUserMessages,
  saveUserMessages,
  clearUserMessages,
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
