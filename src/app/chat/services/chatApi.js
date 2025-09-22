import axiosInstance from '../../../redux/axiosInstance';

// Use the existing axiosInstance which has JWT authentication and interceptors
const api = axiosInstance;

export const chatApi = {
  // Get all available providers
  getProviders: async () => {
    const response = await api.get('/chat/providers');
    return response.data;
  },

  // Send a chat message
  sendMessage: async (request) => {
    console.log('🔍 chatApi.sendMessage - Sending to backend:', request);
    console.log('🔍 chatApi.sendMessage - Model in request:', request.model, 'Type:', typeof request.model, 'IsArray:', Array.isArray(request.model));
    
    // CRITICAL CHECK: Ensure model is never an array
    if (Array.isArray(request.model)) {
      console.error('🚨 CRITICAL ERROR: chatApi received array model! Fixing:', request.model);
      request.model = request.model[0] || 'gpt-4';
      console.log('✅ chatApi - Fixed model to:', request.model);
    }
    
    const response = await api.post('/chat/message', request);
    console.log('🔍 chatApi.sendMessage - Backend response:', response.data);
    return response.data;
  },

  // Get MCP tools
  getTools: async () => {
    const response = await api.get('/chat/tools');
    return response.data;
  },

  // Get RAG status
  getRagStatus: async () => {
    const response = await api.get('/chat/rag');
    return response.data;
  },

  // Get models for a specific provider
  getModelsForProvider: async (providerName) => {
    const response = await api.get(`/chat/providers/${providerName}/models`);
    return response.data;
  },

  // Get user's chat list/conversations
  getUserChats: async (userId) => {
    console.log('🔍 chatApi.getUserChats - Requesting chats for userId:', userId);
    console.log('🔍 Current axios baseURL:', api.defaults.baseURL);
    console.log('🔍 JWT Token present:', !!localStorage.getItem('jwtToken'));
    
    try {
      const response = await api.get(`/chat/users/${userId}/chats`);
      console.log('✅ chatApi.getUserChats - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ chatApi.getUserChats - Error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      throw error;
    }
  },

  // Get specific conversation messages
  getConversationMessages: async (userId, conversationId) => {
    console.log('chatApi.getConversationMessages - Requesting messages for:', { userId, conversationId });
    try {
      const response = await api.get(`/chat/users/${userId}/conversations/${conversationId}/messages`);
      console.log('chatApi.getConversationMessages - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('chatApi.getConversationMessages - Error:', error);
      throw error;
    }
  },

  // Get user's chat statistics
  getUserChatStats: async (userId) => {
    console.log('chatApi.getUserChatStats - Requesting stats for userId:', userId);
    try {
      const response = await api.get(`/chat/users/${userId}/stats`);
      console.log('chatApi.getUserChatStats - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('chatApi.getUserChatStats - Error:', error);
      throw error;
    }
  },
};

export default chatApi;
