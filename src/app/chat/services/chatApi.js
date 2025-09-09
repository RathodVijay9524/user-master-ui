import axios from 'axios';
import { getApiBaseUrl, getEnvironmentInfo } from '../config/environment.js';

const API_BASE_URL = getApiBaseUrl();

console.log('🔧 API Configuration:');
console.log('Current hostname:', window.location.hostname);
console.log('Current protocol:', window.location.protocol);
console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Selected API_BASE_URL:', API_BASE_URL);

// Mobile-specific debugging
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log('📱 Mobile Detection:', {
  isMobile,
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  cookieEnabled: navigator.cookieEnabled,
  onLine: navigator.onLine
});

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
    console.log('Full URL:', `${config.baseURL}${config.url}`);
    console.log('Request data:', config.data);
    console.log('User Agent:', navigator.userAgent);
    console.log('Is Mobile:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
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
    console.log('Response data:', response.data);
    console.log('📱 Mobile Response Debug:', {
      isMobile,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.error('❌ Response error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error config:', error.config);
    console.error('Network error:', error.code);
    console.error('📱 Mobile Error Debug:', {
      isMobile,
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      errorStatus: error.response?.status,
      errorStatusText: error.response?.statusText,
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED',
      isCORS: error.message?.includes('CORS') || error.message?.includes('cross-origin'),
      timestamp: new Date().toISOString()
    });
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
