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
};

export default chatApi;
