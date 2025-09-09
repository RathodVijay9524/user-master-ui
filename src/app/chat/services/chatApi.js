import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9091';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const response = await api.get('/api/chat/providers');
    return response.data;
  },

  // Send a chat message
  sendMessage: async (request) => {
    console.log('chatApi.sendMessage - Sending to backend:', request);
    const response = await api.post('/api/chat/message', request);
    console.log('chatApi.sendMessage - Backend response:', response.data);
    return response.data;
  },

  // Get MCP tools
  getTools: async () => {
    const response = await api.get('/api/chat/tools');
    return response.data;
  },

  // Get RAG status
  getRagStatus: async () => {
    const response = await api.get('/api/chat/rag');
    return response.data;
  },

  // Get models for a specific provider
  getModelsForProvider: async (providerName) => {
    const response = await api.get(`/api/chat/providers/${providerName}/models`);
    return response.data;
  },
};

export default chatApi;
