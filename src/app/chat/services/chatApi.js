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
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log(`✅ Response received from: ${response.config.url}`, response.status);
    if (isMobile) {
      console.log('📱 Mobile Response Success:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url
      });
    }
    return response;
  },
  (error) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.error('❌ Response error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error config:', error.config);
    console.error('Network error:', error.code);
    
    if (isMobile) {
      console.error('📱 Mobile Error Details:', {
        isMobile: true,
        errorName: error.name,
        errorMessage: error.message,
        errorCode: error.code,
        errorStatus: error.response?.status,
        errorStatusText: error.response?.statusText,
        isNetworkError: !error.response,
        isTimeout: error.code === 'ECONNABORTED',
        isCORS: error.message?.includes('CORS') || error.message?.includes('cross-origin'),
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
    }
    
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