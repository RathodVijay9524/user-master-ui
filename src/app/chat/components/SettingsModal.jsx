import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProvider, setModel, setApiKey, setBaseUrl, setTemperature, setMaxTokens, clearSettings, fetchProviders, fetchModelsForProvider } from "../../../redux/chat/settingsSlice";
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
    return {
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
  });

  // Fetch providers and models from backend on component mount
  useEffect(() => {
    dispatch(fetchProviders());
  }, [dispatch]);

  // Fetch models when provider changes
  useEffect(() => {
    if (selectedProvider) {
      dispatch(fetchModelsForProvider(selectedProvider));
    }
  }, [selectedProvider, dispatch]);

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

              if (providerSettings.apiKey) {
                dispatch(setApiKey(providerSettings.apiKey));
              }
              if (providerSettings.baseUrl) {
                dispatch(setBaseUrl(providerSettings.baseUrl));
              }
              if (providerSettings.model) {
                dispatch(setModel(providerSettings.model));
              }
            }
          });
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
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
  }, [selectedProvider, model, apiKey, baseUrl, availableModels]);

  useEffect(() => {
    if (!availableModels || availableModels.length === 0) return;
    if (!model || !availableModels.includes(model)) {
      dispatch(setModel(availableModels[0]));
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className={`${currentTheme.sidebar} border rounded-2xl backdrop-blur-md w-full max-w-lg mx-4 shadow-2xl overflow-hidden animate-scale-in`}>
        {/* Header */}
        <div className={`${currentTheme.bubble} border-b backdrop-blur-sm`}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">⚙️</span>
              </div>
              <div>
                <h2 className={`text-xl font-bold ${currentTheme.text}`}>AI Settings</h2>
                <p className={`text-sm ${currentTheme.text} opacity-60`}>Configure your AI experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl ${currentTheme.bubble} border hover:scale-110 transition-all duration-200 backdrop-blur-sm`}
              title="Close Settings"
            >
              <span className={`${currentTheme.text} text-lg`}>✕</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 px-6 pb-4">
            {[
              { id: "provider", label: "Provider", icon: "🤖" },
              { id: "config", label: "Config", icon: "🔧" },
              { id: "about", label: "About", icon: "ℹ️" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${currentTheme.userBubble} text-white shadow-lg`
                    : `${currentTheme.bubble} ${currentTheme.text} opacity-70 hover:opacity-100 hover:scale-105`
                } border backdrop-blur-sm`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === "provider" && (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-3`}>
                  Select AI Provider
                </label>
                <div className="space-y-3">
                  {isLoading && availableProviders.length === 0 ? (
                    <div className={`w-full p-4 rounded-xl border ${currentTheme.bubble} ${currentTheme.text} flex items-center justify-center`}>
                      <span className="text-sm opacity-70">⏳ Loading providers...</span>
                    </div>
                  ) : error ? (
                    <div className={`w-full p-4 rounded-xl border ${currentTheme.bubble} ${currentTheme.text} flex items-center justify-center`}>
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
                      className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center space-x-4 hover:scale-[1.02] ${
                        selectedProvider === option.value
                          ? `bg-gradient-to-r ${option.color} text-white shadow-lg border-transparent`
                          : `${currentTheme.bubble} ${currentTheme.text} hover:bg-white/5 backdrop-blur-sm`
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedProvider === option.value ? "bg-white/20" : currentTheme.bubble
                      }`}>
                        <span className="text-2xl">{option.emoji}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-base">{option.label}</div>
                        <div className={`text-xs ${
                          selectedProvider === option.value ? "text-white/80" : `${currentTheme.text} opacity-60`
                        }`}>
                          {selectedProvider === option.value ? "Currently active" : "Tap to select"}
                        </div>
                      </div>
                      {selectedProvider === option.value && (
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </button>
                    ))
                  )}
                </div>
              </div>

              {/* Provider Status */}
              <div className={`p-4 rounded-xl border ${currentTheme.bubble}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${currentTheme.text}`}>Provider Status</span>
                  <div className={`flex items-center space-x-2`}>
                    <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-xs ${currentTheme.text} opacity-60`}>
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <div className={`text-xs ${currentTheme.text} opacity-60`}>
                  <div><strong>Provider:</strong> {displayName}</div>
                  <div><strong>Description:</strong> {description}</div>
                  <div><strong>Status:</strong> {status}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="space-y-6">
              {/* Model Selection */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-3`}>
                  Select Model
                </label>
                <select
                  value={model}
                  onChange={(e) => dispatch(setModel(e.target.value))}
                  className={`w-full p-3 rounded-xl border ${currentTheme.bubble} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  style={{ background: currentTheme.input, color: currentTheme.text, borderColor: currentTheme.border }}
                >
                  {availableModels.length > 0 ? (
                    availableModels.map((modelOption) => (
                      <option key={modelOption} value={modelOption}>
                        {modelOption}
                      </option>
                    ))
                  ) : (
                    <option value="">No models available</option>
                  )}
                </select>
                <p className={`text-xs ${currentTheme.text} opacity-60 mt-1`}>
                  Select a model for your AI provider
                </p>
              </div>

              {/* Temperature Setting */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-3`}>
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
                  <span>1 (Balanced)</span>
                  <span>2 (Creative)</span>
                </div>
              </div>

              {/* Max Tokens Setting */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-3`}>
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
                  <span>2000</span>
                  <span>4000</span>
                </div>
              </div>

              {selectedProvider !== "ollama" && (
                <>
                  {/* API Key */}
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-3`}>
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey || ""}
                        onChange={(e) => dispatch(setApiKey(e.target.value))}
                        placeholder="Enter your API key..."
                        className={`w-full ${currentTheme.input} border rounded-xl px-4 py-3 pr-12 ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200`}
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg ${currentTheme.bubble} hover:scale-110 transition-all duration-200`}
                        title={showApiKey ? "Hide API Key" : "Show API Key"}
                      >
                        <span className={`text-sm ${currentTheme.text} opacity-70`}>
                          {showApiKey ? "🙈" : "👁️"}
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Base URL for all providers except Ollama */}
              {selectedProvider !== "ollama" && (
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.text} mb-3`}>
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
                    className={`w-full ${currentTheme.input} border rounded-xl px-4 py-3 ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200`}
                  />
                </div>
              )}

              {selectedProvider === "ollama" && (
                <>
                  <div className={`p-4 rounded-xl ${currentTheme.bubble} border backdrop-blur-sm`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">🦙</span>
                      <span className={`font-medium ${currentTheme.text}`}>Local Ollama Setup</span>
                    </div>
                    <p className={`text-sm ${currentTheme.text} opacity-70`}>
                      Ollama runs locally on your machine. Make sure Ollama is installed and running on your system.
                    </p>
                  </div>

                  {/* Base URL for Ollama */}
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-3`}>
                      Ollama Base URL
                    </label>
                    <input
                      type="text"
                      value={baseUrl || "http://localhost:11434"}
                      onChange={(e) => dispatch(setBaseUrl(e.target.value))}
                      placeholder="http://localhost:11434"
                      className={`w-full ${currentTheme.input} border rounded-xl px-4 py-3 ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200`}
                    />
                    <p className={`text-xs ${currentTheme.text} opacity-60 mt-1`}>
                      Default: http://localhost:11434 (change if your Ollama runs on a different host/port)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6">
              <div className={`text-center p-6 rounded-xl ${currentTheme.bubble} border backdrop-blur-sm`}>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className={`text-lg font-bold ${currentTheme.text} mb-2`}>Neural Chat AI</h3>
                <p className={`text-sm ${currentTheme.text} opacity-60 mb-4`}>
                  Advanced AI chat interface with multiple provider support
                </p>
                <div className={`text-xs ${currentTheme.text} opacity-50`}>
                  Version 2.0.1
                </div>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${currentTheme.bubble} border backdrop-blur-sm`}>
                  <h4 className={`font-medium ${currentTheme.text} mb-2`}>🔧 Features</h4>
                  <ul className={`text-sm ${currentTheme.text} opacity-70 space-y-1`}>
                    <li>• Multiple AI provider support</li>
                    <li>• Voice message recording</li>
                    <li>• Theme customization</li>
                    <li>• Mobile-responsive design</li>
                    <li>• Settings persistence</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-xl ${currentTheme.bubble} border backdrop-blur-sm`}>
                  <h4 className={`font-medium ${currentTheme.text} mb-2`}>📊 Usage Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${currentTheme.text} opacity-70`}>Current Provider:</span>
                      <span className={`text-sm ${currentTheme.text} font-medium`}>
                        {providerOptions.find((p) => p.value === selectedProvider)?.label || selectedProvider}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${currentTheme.text} opacity-70`}>Model:</span>
                      <span className={`text-sm ${currentTheme.text} font-medium`}>{model || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${currentTheme.text} opacity-70`}>Settings Saved:</span>
                      <span className={`text-sm ${currentTheme.text} font-medium`}>
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
        <div className={`${currentTheme.bubble} border-t backdrop-blur-sm p-6`}>
          <div className="flex justify-between items-center">
            <button
              onClick={handleReset}
              className={`px-4 py-2 rounded-xl border ${currentTheme.bubble} ${currentTheme.text} hover:scale-105 transition-all duration-200 backdrop-blur-sm flex items-center space-x-2`}
              title="Reset all settings"
            >
              <span className="text-sm">🔄</span>
              <span className="text-sm">Reset</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className={`px-6 py-2 rounded-xl ${currentTheme.bubble} border ${currentTheme.text} hover:scale-105 transition-all duration-200 backdrop-blur-sm`}
              >
                <span className="text-sm font-medium">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className={`px-6 py-2 rounded-xl ${currentTheme.userBubble} text-white hover:scale-105 transition-all duration-200 shadow-lg font-medium`}
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
