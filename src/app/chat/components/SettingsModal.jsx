
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProvider, setModel, setApiKey, setBaseUrl, setTemperature, setMaxTokens, clearSettings, fetchProviders, fetchModelsForProvider, setModelForProvider, setApiKeyForProvider, setBaseUrlForProvider, setProviderApiKey, setProviderBaseUrl, setProviderModel, setProviderTemperature, setProviderMaxTokens } from "../../../redux/chat/settingsSlice";
import { useAppDispatch } from "../../../redux/chat/hooks";

export default function SettingsModal({ onClose, theme }) {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("provider");
  const [showApiKey, setShowApiKey] = useState(false);
  const [ollamaModels, setOllamaModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Default theme fallback
  const currentTheme = theme || {
    sidebar: "#0a0f1c",
    main: "#0f172a",
    bubble: "#1e293b",
    input: "#1e293b",
    text: "#e5e7eb",
    border: "#1f2937",
    userBubble: "#10b981",
  };

  const { selectedProvider, model, apiKey, baseUrl, availableModels, availableProviders, temperature, maxTokens, displayName, description, isAvailable, status, isLoading, error } = useSelector((state) => {
    const provider = state.settings.selectedProvider;
    const result = {
      selectedProvider: provider,
      model: state.settings.providers[provider]?.model || '',
      apiKey: state.settings.providers[provider]?.apiKey || '',
      baseUrl: state.settings.providers[provider]?.baseUrl || '',
      availableModels: state.settings.providers[provider]?.availableModels || [],
      availableProviders: state.settings.availableProviders || [],
      temperature: state.settings.providers[provider]?.temperature || 0.7,
      maxTokens: state.settings.providers[provider]?.maxTokens || 1000,
      displayName: state.settings.providers[provider]?.displayName || '',
      description: state.settings.providers[provider]?.description || '',
      isAvailable: state.settings.providers[provider]?.isAvailable || false,
      status: state.settings.providers[provider]?.status || 'inactive',
      isLoading: state.settings.isLoading,
      error: state.settings.error,
    };
    
    // Debug logging
    console.log(`SettingsModal - Provider: ${provider}, Available Models:`, result.availableModels, 'Type:', typeof result.availableModels);
    console.log(`SettingsModal - API Key:`, result.apiKey ? `${result.apiKey.substring(0, 8)}...` : 'empty');
    console.log(`SettingsModal - Model:`, result.model);
    
    return result;
  });

  // Fetch providers and models from backend on component mount
  useEffect(() => {
    dispatch(fetchProviders());
  }, [dispatch]);


  // Fetch models when provider changes - with proper dependency management
  useEffect(() => {
    if (selectedProvider && selectedProvider !== 'ollama') {
      console.log(`🔍 Fetching models for provider: ${selectedProvider}`);
      dispatch(fetchModelsForProvider(selectedProvider));
    }
  }, [selectedProvider, dispatch]);

  // Also fetch models when availableModels is empty for the current provider
  useEffect(() => {
    if (selectedProvider && (!availableModels || availableModels.length === 0) && selectedProvider !== 'ollama') {
      console.log(`🔍 No models available for ${selectedProvider}, fetching...`);
      dispatch(fetchModelsForProvider(selectedProvider));
    }
  }, [selectedProvider, availableModels, dispatch]);

  // Retry mechanism for model fetching
  useEffect(() => {
    if (selectedProvider && selectedProvider !== 'ollama') {
      const retryFetch = () => {
        if (!availableModels || availableModels.length === 0) {
          console.log(`🔄 Retrying model fetch for ${selectedProvider}...`);
          dispatch(fetchModelsForProvider(selectedProvider));
        }
      };
      
      // Retry after 2 seconds if models are still empty
      const timeoutId = setTimeout(retryFetch, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedProvider, availableModels, dispatch]);


  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('neural-chat-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);

          // Restore provider
          if (settings.selectedProvider) {
            dispatch(setProvider(settings.selectedProvider));
          }

          // Restore provider-specific settings
          Object.keys(settings).forEach(provider => {
            if (provider !== 'selectedProvider' && typeof settings[provider] === 'object') {
              const providerSettings = settings[provider];
              
              console.log(`Loading settings for provider: ${provider}`, providerSettings);

              if (providerSettings.apiKey) {
                dispatch(setProviderApiKey({ provider, apiKey: providerSettings.apiKey }));
              }
              if (providerSettings.baseUrl) {
                dispatch(setProviderBaseUrl({ provider, baseUrl: providerSettings.baseUrl }));
              }
              if (providerSettings.model) {
                console.log(`Loading model for ${provider}:`, providerSettings.model, 'Type:', typeof providerSettings.model);
                // Fix: Only set model if it's a string, not an array
                if (typeof providerSettings.model === 'string') {
                  dispatch(setProviderModel({ provider, model: providerSettings.model }));
                } else {
                  console.warn(`Skipping corrupted model data for ${provider}:`, providerSettings.model);
                }
              }
              if (providerSettings.temperature !== undefined) {
                dispatch(setProviderTemperature({ provider, temperature: providerSettings.temperature }));
              }
              if (providerSettings.maxTokens !== undefined) {
                dispatch(setProviderMaxTokens({ provider, maxTokens: providerSettings.maxTokens }));
              }
            }
          });
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
        // Clear corrupted localStorage
        localStorage.removeItem('neural-chat-settings');
      }
    };

    loadSettings();
  }, [dispatch]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const saveSettings = () => {
      try {
        const currentState = {
          selectedProvider,
          [selectedProvider]: {
            model,
            apiKey,
            baseUrl,
            temperature,
            maxTokens,
            availableModels
          }
        };

        // Merge with existing settings to preserve other providers' data
        const existingSettings = localStorage.getItem('neural-chat-settings');
        let settings = existingSettings ? JSON.parse(existingSettings) : {};

        settings.selectedProvider = selectedProvider;
        settings[selectedProvider] = {
          ...settings[selectedProvider],
          model,
          apiKey,
          baseUrl,
          temperature,
          maxTokens,
          availableModels
        };

        localStorage.setItem('neural-chat-settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings to localStorage:', error);
      }
    };

    // Only save if we have a selected provider
    if (selectedProvider) {
      saveSettings();
    }
  }, [selectedProvider, model, apiKey, baseUrl, temperature, maxTokens, availableModels]);

  useEffect(() => {
    // Handle case where availableModels might be a string
    let models = availableModels;
    if (typeof models === 'string') {
      try {
        models = JSON.parse(models);
      } catch (e) {
        models = [];
      }
    }
    
    if (!models || !Array.isArray(models) || models.length === 0) return;
    console.log(`Auto-selection check - Current model:`, model, 'Type:', typeof model, 'Models:', models);
    if (!model || !models.includes(model)) {
      console.log(`Auto-selecting first model: ${models[0]} for provider: ${selectedProvider}`);
      dispatch(setModel(models[0]));
    }
  }, [selectedProvider, availableModels, dispatch, model]);

  // Fetch Ollama models when the config tab is active and Ollama is selected
  useEffect(() => {
    if (activeTab === "config" && selectedProvider === "ollama") {
      fetchOllamaModels();
    }
  }, [activeTab, selectedProvider]);

  const fetchOllamaModels = async () => {
    setIsLoadingModels(true);
    try {
      // Use the Ollama API directly to get available models
      const ollamaBaseUrl = baseUrl || "http://localhost:11434";
      const response = await fetch(`${ollamaBaseUrl}/api/tags`);

      if (response.ok) {
        const data = await response.json();
        const models = data.models ? data.models.map((model) => model.name) : [];
        setOllamaModels(models);

        // If no model is selected or the selected model is not in the available list,
        // automatically select the first available model
        if (models.length > 0 && (!model || !models.includes(model))) {
          dispatch(setModel(models[0]));
        }
      } else {
        console.error('Failed to fetch Ollama models');
        setOllamaModels([]);
      }
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      setOllamaModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Provider options with emojis and colors
  const providerEmojis = {
    claude: "🤖",
    gemini: "💎", 
    groq: "⚡",
    huggingface: "🤗",
    ollama: "🦙",
    openai: "🔑",
    openrouter: "🌐"
  };

  const providerColors = {
    claude: "from-orange-500 to-red-500",
    gemini: "from-blue-500 to-purple-500",
    groq: "from-yellow-500 to-orange-500", 
    huggingface: "from-pink-500 to-rose-500",
    ollama: "from-green-500 to-emerald-500",
    openai: "from-indigo-500 to-blue-500",
    openrouter: "from-purple-500 to-pink-500"
  };

  // Use backend data if available, otherwise fallback to hardcoded options
  const hardcodedProviders = [
    { value: "claude", label: "Anthropic Claude", emoji: "🤖", color: "from-orange-500 to-red-500" },
    { value: "gemini", label: "Google Gemini", emoji: "💎", color: "from-blue-500 to-purple-500" },
    { value: "groq", label: "Groq", emoji: "⚡", color: "from-yellow-500 to-orange-500" },
    { value: "huggingface", label: "Hugging Face", emoji: "🤗", color: "from-pink-500 to-rose-500" },
    { value: "ollama", label: "Ollama", emoji: "🦙", color: "from-green-500 to-emerald-500" },
    { value: "openai", label: "OpenAI", emoji: "🔑", color: "from-indigo-500 to-blue-500" },
    { value: "openrouter", label: "OpenRouter", emoji: "🌐", color: "from-purple-500 to-pink-500" },
  ];

  const providerOptions = availableProviders.length > 0 
    ? availableProviders.map((provider) => ({
        value: provider.name,
        label: provider.displayName || provider.name,
        emoji: providerEmojis[provider.name] || "🤖",
        color: providerColors[provider.name] || "from-blue-500 to-purple-500"
      }))
    : hardcodedProviders;

  const handleSave = () => {
    onClose();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings? This action cannot be undone.")) {
      // Clear localStorage
      try {
        localStorage.removeItem('neural-chat-settings');
      } catch (error) {
        console.error('Error clearing settings from localStorage:', error);
      }

      // Clear Redux state
      dispatch(clearSettings());
      setOllamaModels([]);
    }
  };

  // Get the current provider's color for model selection
  const getProviderColor = () => {
    const provider = providerOptions.find((p) => p.value === selectedProvider);
    return provider ? provider.color : "from-blue-500 to-purple-500";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div 
        className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:mx-4 border-0 sm:border sm:rounded-2xl backdrop-blur-md shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in"
        style={{ backgroundColor: currentTheme.sidebar, borderColor: currentTheme.border }}
      >
        {/* Header */}
        <div 
          className="border-b backdrop-blur-sm sticky top-0 z-10"
          style={{ backgroundColor: currentTheme.bubble, borderColor: currentTheme.border }}
        >
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-lg sm:text-xl">⚙️</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold" style={{ color: currentTheme.text }}>AI Settings</h2>
                <p className="text-xs sm:text-sm opacity-60" style={{ color: currentTheme.text }}>Configure your AI experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border hover:scale-110 transition-all duration-200 backdrop-blur-sm"
              style={{ backgroundColor: currentTheme.bubble, borderColor: currentTheme.border }}
              title="Close Settings"
            >
              <span className="text-lg" style={{ color: currentTheme.text }}>✕</span>
            </button>
          </div>

          {/* Mobile-First Tabs */}
          <div className="flex space-x-1 px-4 sm:px-6 pb-3 sm:pb-4 overflow-x-auto">
            {[
              { id: "provider", label: "Provider", icon: "🤖" },
              { id: "config", label: "Config", icon: "🔧" },
              { id: "about", label: "About", icon: "ℹ️" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap border backdrop-blur-sm ${
                  activeTab === tab.id
                    ? "bg-green-500 text-white shadow-lg"
                    : "opacity-70 hover:opacity-100 hover:scale-105"
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? "#10b981" : currentTheme.bubble,
                  color: activeTab === tab.id ? "#ffffff" : currentTheme.text,
                  borderColor: currentTheme.border
                }}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content with mobile-optimized scrolling */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {activeTab === "provider" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: currentTheme.text }}>
                  Select AI Provider
                </label>
                <div className="space-y-2 sm:space-y-3">
                  {isLoading && availableProviders.length === 0 ? (
                    <div 
                      className="w-full p-3 sm:p-4 rounded-xl border flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.bubble, color: currentTheme.text, borderColor: currentTheme.border }}
                    >
                      <span className="text-sm opacity-70">⏳ Loading providers...</span>
                    </div>
                  ) : error ? (
                    <div 
                      className="w-full p-3 sm:p-4 rounded-xl border flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.bubble, color: currentTheme.text, borderColor: currentTheme.border }}
                    >
                      <div className="text-center">
                        <span className="text-sm text-red-400">❌ Error loading providers</span>
                        <p className="text-xs opacity-60 mt-1">{error}</p>
                        <button 
                          onClick={() => dispatch(fetchProviders())}
                          className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : (
                    providerOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => dispatch(setProvider(option.value))}
                      className={`w-full p-3 sm:p-4 rounded-xl border transition-all duration-200 flex items-center space-x-3 sm:space-x-4 hover:scale-[1.02] ${
                        selectedProvider === option.value
                          ? `bg-gradient-to-r ${option.color} text-white shadow-lg border-transparent`
                          : "hover:bg-white/5 backdrop-blur-sm"
                      }`}
                      style={{
                        backgroundColor: selectedProvider === option.value ? undefined : currentTheme.bubble,
                        color: selectedProvider === option.value ? "#ffffff" : currentTheme.text,
                        borderColor: selectedProvider === option.value ? "transparent" : currentTheme.border
                      }}
                    >
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: selectedProvider === option.value ? "rgba(255,255,255,0.2)" : currentTheme.bubble
                        }}
                      >
                        <span className="text-lg sm:text-2xl">{option.emoji}</span>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-semibold text-sm sm:text-base truncate">{option.label}</div>
                        <div className={`text-xs ${
                          selectedProvider === option.value ? "text-white/80" : `opacity-60`
                        }`}>
                          {selectedProvider === option.value ? "Currently active" : "Tap to select"}
                        </div>
                      </div>
                      {selectedProvider === option.value && (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs sm:text-sm">✓</span>
                        </div>
                      )}
                    </button>
                    ))
                  )}
                </div>
              </div>

              {/* Provider Status - Mobile optimized */}
              <div 
                className="p-3 sm:p-4 rounded-xl border"
                style={{ backgroundColor: currentTheme.bubble, borderColor: currentTheme.border }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: currentTheme.text }}>Provider Status</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs opacity-60" style={{ color: currentTheme.text }}>
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <div className="text-xs opacity-60 space-y-1" style={{ color: currentTheme.text }}>
                  <div><strong>Provider:</strong> {displayName}</div>
                  <div className="break-words"><strong>Description:</strong> {description}</div>
                  <div><strong>Status:</strong> {status}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: currentTheme.text }}>
                  Select Model
                </label>
                <select
                  value={Array.isArray(model) ? model[0] || '' : model || ''}
                  onChange={(e) => dispatch(setModel(e.target.value))}
                  className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  style={{ 
                    background: currentTheme.input, 
                    color: currentTheme.text, 
                    borderColor: currentTheme.border 
                  }}
                  disabled={isLoadingModels}
                >
                  {isLoadingModels ? (
                    <option value="">Loading models...</option>
                  ) : (() => {
                    // Handle case where availableModels might be a string or array
                    let models = availableModels;
                    if (typeof models === 'string') {
                      try {
                        models = JSON.parse(models);
                      } catch (e) {
                        models = [];
                      }
                    }
                    
                    // Also handle case where availableModels is an array containing a string
                    if (Array.isArray(availableModels) && availableModels.length === 1 && typeof availableModels[0] === 'string') {
                      try {
                        const parsed = JSON.parse(availableModels[0]);
                        if (Array.isArray(parsed)) {
                          models = parsed;
                        }
                      } catch (e) {
                        // Silent fail
                      }
                    }
                    
                    
                    return Array.isArray(models) && models.length > 0 ? (
                      models.map((modelOption) => (
                        <option key={modelOption} value={modelOption}>
                          {modelOption}
                        </option>
                      ))
                    ) : (
                      <option value="">No models available</option>
                    );
                  })()}
                </select>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs opacity-60" style={{ color: currentTheme.text }}>
                    Select a model for your AI provider
                  </p>
                  {selectedProvider !== 'ollama' && (
                    <button
                      onClick={() => {
                        console.log(`🔄 Manual refresh for ${selectedProvider}`);
                        dispatch(fetchModelsForProvider(selectedProvider));
                      }}
                      className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
                    >
                      🔄 Refresh
                    </button>
                  )}
                </div>
              </div>

              {/* Temperature Setting */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: currentTheme.text }}>
                  Temperature: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => dispatch(setTemperature(parseFloat(e.target.value)))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ background: currentTheme.bubble }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 (Focused)</span>
                  <span className="hidden sm:inline">1 (Balanced)</span>
                  <span>2 (Creative)</span>
                </div>
              </div>

              {/* Max Tokens Setting */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: currentTheme.text }}>
                  Max Tokens: {maxTokens}
                </label>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => dispatch(setMaxTokens(parseInt(e.target.value)))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ background: currentTheme.bubble }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>100</span>
                  <span className="hidden sm:inline">2000</span>
                  <span>4000</span>
                </div>
              </div>

              {selectedProvider !== "ollama" && (
                <>
                  {/* API Key */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: currentTheme.text }}>
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey || ""}
                        onChange={(e) => dispatch(setApiKey(e.target.value))}
                        placeholder="Enter your API key..."
                        className="w-full border rounded-xl px-4 py-3 pr-12 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200"
                        style={{ 
                          backgroundColor: currentTheme.input, 
                          color: currentTheme.text,
                          borderColor: currentTheme.border
                        }}
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:scale-110 transition-all duration-200"
                        style={{ backgroundColor: currentTheme.bubble }}
                        title={showApiKey ? "Hide API Key" : "Show API Key"}
                      >
                        <span className="text-sm opacity-70" style={{ color: currentTheme.text }}>
                          {showApiKey ? "🙈" : "👁️"}
                        </span>
                      </button>
                    </div>
                    {/* Save API Key Button */}
                    <button
                      onClick={() => {
                        // Force save the current API key to localStorage
                        try {
                          const existingSettings = localStorage.getItem('neural-chat-settings');
                          let settings = existingSettings ? JSON.parse(existingSettings) : {};
                          
                          if (!settings[selectedProvider]) {
                            settings[selectedProvider] = {};
                          }
                          
                          settings[selectedProvider].apiKey = apiKey;
                          localStorage.setItem('neural-chat-settings', JSON.stringify(settings));
                          
                          console.log(`API key manually saved for ${selectedProvider}:`, apiKey ? `${apiKey.substring(0, 8)}...` : 'empty');
                          
                          // Close the modal instead of showing alert
                          onClose();
                        } catch (error) {
                          console.error('Error saving API key:', error);
                          alert('Error saving API key!');
                        }
                      }}
                      className="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      💾 Save API Key
                    </button>
                  </div>
                </>
              )}

              {/* Base URL for all providers except Ollama */}
              {selectedProvider !== "ollama" && (
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: currentTheme.text }}>
                    Base URL
                  </label>
                  <input
                    type="text"
                    value={baseUrl || ""}
                    onChange={(e) => dispatch(setBaseUrl(e.target.value))}
                    placeholder={selectedProvider === "openai"
                      ? "https://api.openai.com/v1"
                      : selectedProvider === "gemini"
                        ? "https://generativelanguage.googleapis.com/v1beta"
                        : "https://openrouter.ai/api/v1"
                    }
                    className="w-full border rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200"
                    style={{ 
                      backgroundColor: currentTheme.input, 
                      color: currentTheme.text,
                      borderColor: currentTheme.border
                    }}
                  />
                </div>
              )}

              {selectedProvider === "ollama" && (
                <>
                  <div 
                    className="p-3 sm:p-4 rounded-xl border backdrop-blur-sm"
                    style={{ backgroundColor: currentTheme.bubble, borderColor: currentTheme.border }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xl sm:text-2xl">🦙</span>
                      <span className="font-medium" style={{ color: currentTheme.text }}>Local Ollama Setup</span>
                    </div>
                    <p className="text-sm opacity-70" style={{ color: currentTheme.text }}>
                      Ollama runs locally on your machine. Make sure Ollama is installed and running on your system.
                    </p>
                  </div>

                  {/* Base URL for Ollama */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: currentTheme.text }}>
                      Ollama Base URL
                    </label>
                    <input
                      type="text"
                      value={baseUrl || "http://localhost:11434"}
                      onChange={(e) => dispatch(setBaseUrl(e.target.value))}
                      placeholder="http://localhost:11434"
                      className="w-full border rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200"
                      style={{ 
                        backgroundColor: currentTheme.input, 
                        color: currentTheme.text,
                        borderColor: currentTheme.border
                      }}
                    />
                    <p className="text-xs opacity-60 mt-1" style={{ color: currentTheme.text }}>
                      Default: http://localhost:11434 (change if your Ollama runs on a different host/port)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-4 sm:space-y-6">
              <div 
                className="text-center p-4 sm:p-6 rounded-xl border backdrop-blur-sm"
                style={{ backgroundColor: currentTheme.bubble, borderColor: currentTheme.border }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">🤖</span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: currentTheme.text }}>Neural Chat AI</h3>
                <p className="text-sm opacity-60 mb-3 sm:mb-4" style={{ color: currentTheme.text }}>
                  Advanced AI chat interface with multiple provider support
                </p>
                <div className="text-xs opacity-50" style={{ color: currentTheme.text }}>
                  Version 2.0.1
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div 
                  className="p-3 sm:p-4 rounded-xl border backdrop-blur-sm"
                  style={{ backgroundColor: currentTheme.bubble, borderColor: currentTheme.border }}
                >
                  <h4 className="font-medium mb-2" style={{ color: currentTheme.text }}>🔧 Features</h4>
                  <ul className="text-sm opacity-70 space-y-1" style={{ color: currentTheme.text }}>
                    <li>• Multiple AI provider support</li>
                    <li>• Voice message recording</li>
                    <li>• Theme customization</li>
                    <li>• Mobile-responsive design</li>
                    <li>• Settings persistence</li>
                  </ul>
                </div>

                <div 
                  className="p-3 sm:p-4 rounded-xl border backdrop-blur-sm"
                  style={{ backgroundColor: currentTheme.bubble, borderColor: currentTheme.border }}
                >
                  <h4 className="font-medium mb-2" style={{ color: currentTheme.text }}>📊 Usage Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70" style={{ color: currentTheme.text }}>Current Provider:</span>
                      <span className="font-medium truncate ml-2" style={{ color: currentTheme.text }}>
                        {providerOptions.find((p) => p.value === selectedProvider)?.label || selectedProvider}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70" style={{ color: currentTheme.text }}>Model:</span>
                      <span className="font-medium truncate ml-2" style={{ color: currentTheme.text }}>{model || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70" style={{ color: currentTheme.text }}>Settings Saved:</span>
                      <span className="font-medium" style={{ color: currentTheme.text }}>
                        {localStorage.getItem('neural-chat-settings') ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`${currentTheme.bubble} border-t backdrop-blur-sm p-4 sm:p-6`}>
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <button
              onClick={handleReset}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl border ${currentTheme.bubble} ${currentTheme.text} hover:scale-105 transition-all duration-200 backdrop-blur-sm flex items-center justify-center space-x-2`}
              title="Reset all settings"
            >
              <span className="text-sm">🔄</span>
              <span className="text-sm">Reset</span>
            </button>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-xl ${currentTheme.bubble} border ${currentTheme.text} hover:scale-105 transition-all duration-200 backdrop-blur-sm`}
              >
                <span className="text-sm font-medium">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-xl ${currentTheme.userBubble} text-white hover:scale-105 transition-all duration-200 shadow-lg font-medium`}
              >
                <span className="text-sm">Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Enhanced Scroll styling */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.2); 
          border-radius: 3px; 
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
