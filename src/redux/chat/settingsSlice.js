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
      model: 'llama-3.1-8b-instant',
      baseUrl: 'https://api.groq.com/openai/v1',
      availableModels: ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'llama-3.1-405b-preview', 'mixtral-8x7b-32768', 'gemma-7b-it', 'claude-3-sonnet-20240229', 'llama-2-70b-4096', 'llama-2-7b-2048'],
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
      console.log(`setModel called for provider: ${provider}, payload:`, action.payload, 'Type:', typeof action.payload);
      
      // Ensure payload is always a string
      let safePayload = action.payload;
      
      // CRITICAL FIX: Handle stringified arrays
      if (typeof safePayload === 'string' && safePayload.startsWith('[') && safePayload.endsWith(']')) {
        try {
          const parsedArray = JSON.parse(safePayload);
          if (Array.isArray(parsedArray)) {
            console.error(`🚨 CRITICAL: setModel received stringified array! Parsing and taking first element:`, parsedArray);
            safePayload = parsedArray[0] || '';
          }
        } catch (e) {
          console.error(`🚨 Failed to parse stringified array in setModel:`, e);
          safePayload = '';
        }
      }
      
      if (Array.isArray(safePayload)) {
        console.warn('🚨 setModel received array payload, taking first element:', safePayload);
        safePayload = safePayload[0] || '';
      }
      if (typeof safePayload !== 'string') {
        console.warn('🚨 setModel received non-string payload, using default:', safePayload);
        safePayload = '';
      }
      
      if (state.providers[provider]) {
        state.providers[provider].model = safePayload;
        console.log(`✅ Model set for ${provider}:`, state.providers[provider].model);
      }
    },
    setModelForProvider: (state, action) => {
      const { provider, model } = action.payload;
      if (state.providers[provider]) {
        state.providers[provider].model = model;
      }
    },
    setApiKey: (state, action) => {
      const provider = state.selectedProvider;
      console.log(`setApiKey called for selected provider: ${provider}`, { apiKey: action.payload ? `${action.payload.substring(0, 8)}...` : 'null' });
      if (state.providers[provider]) {
        state.providers[provider].apiKey = action.payload;
        console.log(`API key set for selected provider ${provider}:`, state.providers[provider].apiKey ? `${state.providers[provider].apiKey.substring(0, 8)}...` : 'null');
      }
    },
    setApiKeyForProvider: (state, action) => {
      const { provider, apiKey } = action.payload;
      console.log(`Setting API key for provider: ${provider}`, { apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'null' });
      if (state.providers[provider]) {
        state.providers[provider].apiKey = apiKey;
        console.log(`API key set for ${provider}:`, state.providers[provider].apiKey ? `${state.providers[provider].apiKey.substring(0, 8)}...` : 'null');
      }
    },
    // Actions for setting values for specific providers (used when loading from localStorage)
    setProviderApiKey: (state, action) => {
      const { provider, apiKey } = action.payload;
      if (state.providers[provider]) {
        state.providers[provider].apiKey = apiKey;
      }
    },
    setProviderBaseUrl: (state, action) => {
      const { provider, baseUrl } = action.payload;
      if (state.providers[provider]) {
        state.providers[provider].baseUrl = baseUrl;
      }
    },
    setProviderModel: (state, action) => {
      const { provider, model } = action.payload;
      console.log(`setProviderModel called for provider: ${provider}, model:`, model, 'Type:', typeof model);
      if (state.providers[provider]) {
        state.providers[provider].model = model;
        console.log(`Provider model set for ${provider}:`, state.providers[provider].model);
      }
    },
    setProviderTemperature: (state, action) => {
      const { provider, temperature } = action.payload;
      if (state.providers[provider]) {
        state.providers[provider].temperature = temperature;
      }
    },
    setProviderMaxTokens: (state, action) => {
      const { provider, maxTokens } = action.payload;
      if (state.providers[provider]) {
        state.providers[provider].maxTokens = maxTokens;
      }
    },
    setBaseUrl: (state, action) => {
      const provider = state.selectedProvider;
      if (state.providers[provider]) {
        state.providers[provider].baseUrl = action.payload;
      }
    },
    setBaseUrlForProvider: (state, action) => {
      const { provider, baseUrl } = action.payload;
      if (state.providers[provider]) {
        state.providers[provider].baseUrl = baseUrl;
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
        groq: { apiKey: '', model: 'llama-3.1-8b-instant', baseUrl: 'https://api.groq.com/openai/v1', availableModels: ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'llama-3.1-405b-preview', 'mixtral-8x7b-32768', 'gemma-7b-it', 'claude-3-sonnet-20240229', 'llama-2-70b-4096', 'llama-2-7b-2048'], temperature: 0.7, maxTokens: 1000, displayName: 'Groq', description: 'Groq models', isAvailable: false, status: 'inactive' },
        huggingface: { apiKey: '', model: 'microsoft/DialoGPT-medium', baseUrl: 'https://api-inference.huggingface.co/models', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'Hugging Face', description: 'Hugging Face models', isAvailable: false, status: 'inactive' },
        ollama: { apiKey: '', model: 'qwen2.5-coder:7b', baseUrl: 'http://localhost:11434', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'Ollama', description: 'Ollama models', isAvailable: false, status: 'inactive' },
        openai: { apiKey: '', model: 'gpt-4', baseUrl: 'https://api.openai.com/v1', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'OpenAI', description: 'OpenAI models', isAvailable: false, status: 'inactive' },
        openrouter: { apiKey: '', model: 'openai/gpt-3.5-turbo', baseUrl: 'https://openrouter.ai/api/v1', availableModels: [], temperature: 0.7, maxTokens: 1000, displayName: 'OpenRouter', description: 'OpenRouter models', isAvailable: false, status: 'inactive' },
      };
    },
    
    // Fix corrupted models (for debugging)
    fixCorruptedModels: (state) => {
      console.log('🔧 Fixing corrupted models in Redux state...');
      Object.keys(state.providers).forEach(provider => {
        const providerSettings = state.providers[provider];
        if (providerSettings) {
          // CRITICAL FIX: Handle stringified arrays
          if (typeof providerSettings.model === 'string' && providerSettings.model.startsWith('[') && providerSettings.model.endsWith(']')) {
            try {
              const parsedArray = JSON.parse(providerSettings.model);
              if (Array.isArray(parsedArray)) {
                console.error(`🚨 CRITICAL: ${provider} model is a stringified array! Parsing and taking first element:`, parsedArray);
                providerSettings.model = parsedArray[0] || '';
              }
            } catch (e) {
              console.error(`🚨 Failed to parse stringified array for ${provider}:`, e);
              providerSettings.model = '';
            }
          }
          
          if (Array.isArray(providerSettings.model)) {
            console.warn(`🚨 Found array model for ${provider}, fixing:`, providerSettings.model);
            providerSettings.model = providerSettings.model[0] || '';
          }
          
          // Ensure model is always a string
          if (typeof providerSettings.model !== 'string') {
            console.warn(`🚨 Model for ${provider} is not string, resetting:`, providerSettings.model);
            providerSettings.model = '';
          }
        }
      });
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
            // CRITICAL FIX: Parse stringified arrays in availableModels
            let processedAvailableModels = provider.availableModels;
            if (Array.isArray(processedAvailableModels) && processedAvailableModels.length === 1) {
              const firstElement = processedAvailableModels[0];
              if (typeof firstElement === 'string' && firstElement.startsWith('[') && firstElement.endsWith(']')) {
                try {
                  const parsedModels = JSON.parse(firstElement);
                  if (Array.isArray(parsedModels)) {
                    console.log(`🔧 Fixed availableModels for ${provider.name}:`, parsedModels);
                    processedAvailableModels = parsedModels;
                  }
                } catch (e) {
                  console.error(`🚨 Failed to parse availableModels for ${provider.name}:`, e);
                }
              }
            }
            
            state.providers[provider.name].availableModels = processedAvailableModels;
            state.providers[provider.name].displayName = provider.displayName;
            state.providers[provider.name].description = provider.description;
            state.providers[provider.name].isAvailable = provider.isAvailable;
            state.providers[provider.name].status = provider.status;
            
            // Auto-select first available model if current model is not in the list
            const currentModel = state.providers[provider.name].model;
            const availableModels = provider.availableModels || [];
            
            if (availableModels.length > 0 && (!currentModel || !availableModels.includes(currentModel))) {
              let selectedModel = availableModels[0];
              
              // CRITICAL FIX: Ensure selectedModel is a string, not an array
              if (Array.isArray(selectedModel)) {
                console.error(`🚨 CRITICAL: availableModels[0] is an array in fetchProviders! Taking first element:`, selectedModel);
                selectedModel = selectedModel[0] || '';
              }
              
              if (typeof selectedModel !== 'string') {
                console.error(`🚨 CRITICAL: selectedModel is not a string in fetchProviders! Using default:`, selectedModel);
                selectedModel = '';
              }
              
              state.providers[provider.name].model = selectedModel;
              console.log(`✅ Auto-selected first model for ${provider.name}:`, selectedModel, 'Type:', typeof selectedModel);
            }
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
        console.log('fetchModelsForProvider.fulfilled - Provider:', providerName, 'Models:', models, 'Type:', typeof models);
        
        if (state.providers[providerName]) {
          // Handle case where models might be a string representation of an array
          let processedModels = models;
          if (typeof models === 'string') {
            try {
              processedModels = JSON.parse(models);
            } catch (e) {
              console.error('Failed to parse models string:', e);
              processedModels = [];
            }
          }
          
          // CRITICAL FIX: Handle nested stringified arrays
          if (Array.isArray(processedModels) && processedModels.length === 1) {
            const firstElement = processedModels[0];
            if (typeof firstElement === 'string' && firstElement.startsWith('[') && firstElement.endsWith(']')) {
              try {
                const parsedModels = JSON.parse(firstElement);
                if (Array.isArray(parsedModels)) {
                  console.log(`🔧 Fixed nested stringified models for ${providerName}:`, parsedModels);
                  processedModels = parsedModels;
                }
              } catch (e) {
                console.error(`🚨 Failed to parse nested stringified models for ${providerName}:`, e);
              }
            }
          }
          
          state.providers[providerName].availableModels = Array.isArray(processedModels) ? processedModels : [];
          console.log('Processed models for', providerName, ':', state.providers[providerName].availableModels);
          
          // Auto-select the first available model if no model is currently selected or if current model is not in the available list
          const currentModel = state.providers[providerName].model;
          const availableModels = state.providers[providerName].availableModels;
          
          if (availableModels.length > 0) {
            // If no model is selected or current model is not in available models, select the first one
            if (!currentModel || !availableModels.includes(currentModel)) {
              let selectedModel = availableModels[0];
              
              // CRITICAL FIX: Ensure selectedModel is a string, not an array
              if (Array.isArray(selectedModel)) {
                console.error(`🚨 CRITICAL: availableModels[0] is an array! Taking first element:`, selectedModel);
                selectedModel = selectedModel[0] || '';
              }
              
              if (typeof selectedModel !== 'string') {
                console.error(`🚨 CRITICAL: selectedModel is not a string! Using default:`, selectedModel);
                selectedModel = '';
              }
              
              state.providers[providerName].model = selectedModel;
              console.log(`✅ Auto-selected first model for ${providerName}:`, selectedModel, 'Type:', typeof selectedModel);
            }
          }
        }
      })
      .addCase(fetchModelsForProvider.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  setProvider, 
  setModel, 
  setApiKey, 
  setBaseUrl, 
  setTemperature, 
  setMaxTokens, 
  clearSettings,
  fixCorruptedModels,
  setModelForProvider,
  setApiKeyForProvider,
  setBaseUrlForProvider,
  setProviderApiKey,
  setProviderBaseUrl,
  setProviderModel,
  setProviderTemperature,
  setProviderMaxTokens
} = settingsSlice.actions;
export default settingsSlice.reducer;
