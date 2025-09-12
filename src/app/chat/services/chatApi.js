import axiosInstance from '../../../redux/axiosInstance';

// Use the existing axiosInstance which has JWT authentication
const api = axiosInstance;

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const chatApi = {
  // Get all available providers
  getProviders: async () => {
    const response = await api.get('/chat/providers');
    return response.data;
  },

  // Send a chat message
  sendMessage: async (request) => {
    console.log('chatApi.sendMessage - Sending to backend:', request);
    const response = await api.post('/chat/message', request);
    console.log('chatApi.sendMessage - Backend response:', response.data);
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
    console.log('chatApi.getUserChats - Requesting chats for userId:', userId);
    try {
      const response = await api.get(`/chat/users/${userId}/chats`);
      console.log('chatApi.getUserChats - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('chatApi.getUserChats - Error:', error);
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
