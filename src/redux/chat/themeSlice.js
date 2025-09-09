import { createSlice } from '@reduxjs/toolkit';
import { themes } from './types/theme';

const initialState = {
  currentTheme: 'dark',
  sidebarCollapsed: false,
  selectedProvider: 'gemini',
  gemini: {
    model: 'gemini-pro',
    apiKey: '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    availableModels: ['gemini-pro', 'gemini-pro-vision'],
  },
  ollama: {
    model: 'llama2',
    apiKey: '',
    baseUrl: 'http://localhost:11434',
    availableModels: ['llama2', 'codellama', 'mistral'],
  },
  openai: {
    model: 'gpt-4',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    availableModels: ['gpt-4', 'gpt-3.5-turbo'],
  },
  openrouter: {
    model: 'openai/gpt-4',
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1',
    availableModels: ['openai/gpt-4', 'anthropic/claude-3-sonnet'],
  },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      // Save to localStorage
      localStorage.setItem('chatTheme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    cycleTheme: (state) => {
      const themeOrder = ['dark', 'green', 'light'];
      const currentIndex = themeOrder.indexOf(state.currentTheme);
      const nextIndex = (currentIndex + 1) % themeOrder.length;
      state.currentTheme = themeOrder[nextIndex];
      localStorage.setItem('chatTheme', state.currentTheme);
    },
    setProvider: (state, action) => {
      state.selectedProvider = action.payload;
    },
    setModel: (state, action) => {
      const provider = state.selectedProvider;
      if (state[provider]) {
        state[provider].model = action.payload;
      }
    },
    setApiKey: (state, action) => {
      const provider = state.selectedProvider;
      if (state[provider]) {
        state[provider].apiKey = action.payload;
      }
    },
    setBaseUrl: (state, action) => {
      const provider = state.selectedProvider;
      if (state[provider]) {
        state[provider].baseUrl = action.payload;
      }
    },
    clearSettings: (state) => {
      return initialState;
    },
  },
});

export const { setTheme, toggleSidebar, setSidebarCollapsed, cycleTheme, setProvider, setModel, setApiKey, setBaseUrl, clearSettings } = themeSlice.actions;
export default themeSlice.reducer;

// Selectors
export const selectCurrentTheme = (state) => {
  try {
    return themes[state.theme?.currentTheme] || themes.dark;
  } catch (error) {
    console.error('Error selecting theme:', error);
    return themes.dark;
  }
};
export const selectThemeName = (state) => state.theme?.currentTheme || 'dark';
export const selectSidebarCollapsed = (state) => state.theme?.sidebarCollapsed || false;
