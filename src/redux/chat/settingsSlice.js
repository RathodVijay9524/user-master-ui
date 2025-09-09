import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '../../app/chat/services/chatApi';

// Initial state
const initialState = {
  providers: {
    // Anthropic Claude
    claude: {
      apiKey: '',
      model: 'claude-3-sonnet-20240229',
      baseUrl: 'https://api.anthropic.com',
      availableModels: [],
      temperature: 0.7,
      maxTokens: 1000,
      displayName: 'Anthropic Claude',
      description: 'Anthropic Claude models',
      isAvailable: false,
      status: 'inactive',
    },
    // Google Gemini
    gemini: {
      apiKey: '',
      model: 'gemini-1.5-flash',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      availableModels: [],
      temperature: 0.7,
      maxTokens: 1000,
      displayName: 'Google Gemini',
      description: 'Google Gemini models',
      isAvailable: false,
      status: 'inactive',
    },
    // Groq
    groq: {
      apiKey: '',
      model: 'llama3-70b-8192',
      baseUrl: 'https://api.groq.com/openai/v1',
      availableModels: ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
      temperature: 0.7,
      maxTokens: 1000,
      displayName: 'Groq',
      description: 'Groq models',
      isAvailable: false,
      status: 'inactive',
    },
    // Hugging Face
    huggingface: {
      apiKey: '',
      model: 'microsoft/DialoGPT-medium',
      baseUrl: 'https://api-inference.huggingface.co/models',
      availableModels: [],
      temperature: 0.7,
      maxTokens: 1000,
      displayName: 'Hugging Face',
      description: 'Hugging Face models',
      isAvailable: false,
      status: 'inactive',
    },
    // Ollama
    ollama: {
      apiKey: '',
      model: 'qwen2.5-coder:7b',
      baseUrl: 'http://localhost:11434',
      availableModels: [],
      temperature: 0.7,
      maxTokens: 1000,
      displayName: 'Ollama',
      description: 'Ollama models',
      isAvailable: false,
      status: 'inactive',
    },
    // OpenAI
    openai: {
      apiKey: '',
      model: 'gpt-4',
      baseUrl: 'https://api.openai.com/v1',
      availableModels: [],
      temperature: 0.7,
      maxTokens: 1000,
      displayName: 'OpenAI',
      description: 'OpenAI models',
      isAvailable: false,
      status: 'inactive',
    },
    // OpenRouter
    openrouter: {
      apiKey: '',
      model: 'openai/gpt-3.5-turbo',
      baseUrl: 'https://openrouter.ai/api/v1',
      availableModels: [],
      temperature: 0.7,
      maxTokens: 1000,
      displayName: 'OpenRouter',
      description: 'OpenRouter models',
      isAvailable: false,
      status: 'inactive',
    },
  },
  selectedProvider: 'claude',
  availableProviders: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProviders = createAsyncThunk(
  'settings/fetchProviders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching providers from backend...');
      const providers = await chatApi.getProviders();
      console.log('Providers fetched successfully:', providers);
      return providers;
    } catch (error) {
      console.error('Error fetching providers:', error);
      return rejectWithValue(error.message || 'Failed to fetch providers');
    }
  }
);

export const fetchModelsForProvider = createAsyncThunk(
  'settings/fetchModelsForProvider',
  async (providerName, { rejectWithValue }) => {
    try {
      const models = await chatApi.getModelsForProvider(providerName);
      return { providerName, models };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch models');
    }
  }
);

// Settings slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setProvider: (state, action) => {
      state.selectedProvider = action.payload;
      // Set the default model for the selected provider
      if (state.providers[action.payload]) {
        const defaultModel = state.providers[action.payload].model;
        // Don't change if already set to a valid model
        if (!state.providers[action.payload].model || state.providers[action.payload].model === '') {
          // This will be handled by the useEffect in SettingsModal
        }
      }
    },
    setModel: (state, action) => {
      const provider = state.selectedProvider;
      if (state.providers[provider]) {
        state.providers[provider].model = action.payload;
      }
    },
    setApiKey: (state, action) => {
      const provider = state.selectedProvider;
      if (state.providers[provider]) {
        state.providers[provider].apiKey = action.payload;
      }
    },
    setBaseUrl: (state, action) => {
      const provider = state.selectedProvider;
      if (state.providers[provider]) {
        state.providers[provider].baseUrl = action.payload;
      }
    },
    setTemperature: (state, action) => {
      const provider = state.selectedProvider;
      if (state.providers[provider]) {
        state.providers[provider].temperature = action.payload;
      }
    },
    setMaxTokens: (state, action) => {
      const provider = state.selectedProvider;
      if (state.providers[provider]) {
        state.providers[provider].maxTokens = action.payload;
      }
    },
    clearSettings: (state) => {
      state.providers = {
        claude: { apiKey: '', model: 'claude-3-sonnet-20240229', baseUrl: 'https://api.anthropic.com', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'Anthropic Claude', description: 'Anthropic Claude models', isAvailable: false, status: 'inactive' },
        gemini: { apiKey: '', model: 'gemini-1.5-flash', baseUrl: 'https://generativelanguage.googleapis.com/v1beta', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'Google Gemini', description: 'Google Gemini models', isAvailable: false, status: 'inactive' },
        groq: { apiKey: '', model: 'llama3-70b-8192', baseUrl: 'https://api.groq.com/openai/v1', availableModels: ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768', 'gemma2-9b-it'], temperature: 0.7, maxTokens: 1000, displayName: 'Groq', description: 'Groq models', isAvailable: false, status: 'inactive' },
        huggingface: { apiKey: '', model: 'microsoft/DialoGPT-medium', baseUrl: 'https://api-inference.huggingface.co/models', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'Hugging Face', description: 'Hugging Face models', isAvailable: false, status: 'inactive' },
        ollama: { apiKey: '', model: 'qwen2.5-coder:7b', baseUrl: 'http://localhost:11434', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'Ollama', description: 'Ollama models', isAvailable: false, status: 'inactive' },
        openai: { apiKey: '', model: 'gpt-4', baseUrl: 'https://api.openai.com/v1', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'OpenAI', description: 'OpenAI models', isAvailable: false, status: 'inactive' },
        openrouter: { apiKey: '', model: 'openai/gpt-3.5-turbo', baseUrl: 'https://openrouter.ai/api/v1', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'OpenRouter', description: 'OpenRouter models', isAvailable: false, status: 'inactive' },
      };
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
        state.availableProviders = action.payload;
        
        // Update available models and other properties for each provider
        action.payload.forEach((provider) => {
          if (state.providers[provider.name]) {
            state.providers[provider.name].availableModels = provider.availableModels;
            state.providers[provider.name].displayName = provider.displayName;
            state.providers[provider.name].description = provider.description;
            state.providers[provider.name].isAvailable = provider.isAvailable;
            state.providers[provider.name].status = provider.status;
          }
        });
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch models for provider
      .addCase(fetchModelsForProvider.fulfilled, (state, action) => {
        const { providerName, models } = action.payload;
        if (state.providers[providerName]) {
          state.providers[providerName].availableModels = models;
        }
      })
      .addCase(fetchModelsForProvider.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setProvider, setModel, setApiKey, setBaseUrl, setTemperature, setMaxTokens, clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
