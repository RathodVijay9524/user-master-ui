import axios from 'axios';
import { getApiBaseUrl, getEnvironmentInfo } from '../config/environment.js';

const API_BASE_URL = getApiBaseUrl();

console.log('🔧 API Configuration:');
console.log('Current hostname:', window.location.hostname);
console.log('Current protocol:', window.location.protocol);
console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Selected API_BASE_URL:', API_BASE_URL);

// Basic device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log('Device Detection:', { isMobile, userAgent: navigator.userAgent });

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
    console.log(`✅ Response received from: ${response.config.url}`, response.status);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error config:', error.config);
    console.error('Network error:', error.code);
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
