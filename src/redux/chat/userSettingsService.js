// User-specific settings service to handle user isolation
import { store } from '../store';

class UserSettingsService {
  constructor() {
    this.currentUserId = null;
  }

  // Set current user ID
  setCurrentUser(userId) {
    this.currentUserId = userId;
    this.loadUserSettings(userId);
  }

  // Clear current user (on logout)
  clearCurrentUser() {
    this.currentUserId = null;
  }

  // Generate user-specific localStorage key
  getUserStorageKey(key) {
    return this.currentUserId ? `user_${this.currentUserId}_${key}` : key;
  }

  // Save user-specific settings to localStorage
  saveUserSettings(settings) {
    if (!this.currentUserId) return;
    
    const key = this.getUserStorageKey('chatSettings');
    try {
      localStorage.setItem(key, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save user settings:', error);
    }
  }

  // Load user-specific settings from localStorage
  loadUserSettings(userId) {
    if (!userId) return null;
    
    const key = this.getUserStorageKey('chatSettings');
    try {
      const settings = localStorage.getItem(key);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Failed to load user settings:', error);
      return null;
    }
  }

  // Get user-specific provider settings
  getUserProviderSettings(provider) {
    if (!this.currentUserId) return null;
    
    const settings = this.loadUserSettings(this.currentUserId);
    return settings?.providers?.[provider] || null;
  }

  // Save user-specific provider settings
  saveUserProviderSettings(provider, providerSettings) {
    if (!this.currentUserId) return;
    
    const settings = this.loadUserSettings(this.currentUserId) || { providers: {} };
    settings.providers[provider] = { ...settings.providers[provider], ...providerSettings };
    this.saveUserSettings(settings);
  }

  // Get user-specific selected provider
  getUserSelectedProvider() {
    if (!this.currentUserId) return 'claude';
    
    const settings = this.loadUserSettings(this.currentUserId);
    return settings?.selectedProvider || 'claude';
  }

  // Save user-specific selected provider
  saveUserSelectedProvider(provider) {
    if (!this.currentUserId) return;
    
    const settings = this.loadUserSettings(this.currentUserId) || { providers: {} };
    settings.selectedProvider = provider;
    this.saveUserSettings(settings);
  }

  // Clear all user settings (on logout)
  clearUserSettings() {
    if (!this.currentUserId) return;
    
    const key = this.getUserStorageKey('chatSettings');
    localStorage.removeItem(key);
  }

  // Clear corrupted settings (for debugging)
  clearCorruptedSettings() {
    if (!this.currentUserId) return;
    
    console.log('🧹 Clearing corrupted user settings for user:', this.currentUserId);
    this.clearUserSettings();
  }

  // Initialize user settings with defaults
  initializeUserSettings(userId) {
    if (!userId) return;
    
    const existingSettings = this.loadUserSettings(userId);
    if (existingSettings) {
      // Clean up any array models that might be stored incorrectly
      if (existingSettings.providers) {
        Object.keys(existingSettings.providers).forEach(provider => {
          const providerSettings = existingSettings.providers[provider];
          if (providerSettings && Array.isArray(providerSettings.model)) {
            console.warn(`⚠️ UserSettings - Found array model for ${provider}, fixing:`, providerSettings.model);
            providerSettings.model = providerSettings.model[0] || 'gpt-4';
          }
        });
        // Save cleaned settings
        this.saveUserSettings(existingSettings);
      }
      return existingSettings;
    }
    
    // Default settings for new user
    const defaultSettings = {
      selectedProvider: 'claude',
      providers: {
        claude: {
          apiKey: '',
          model: 'claude-3-sonnet-20240229',
          baseUrl: 'https://api.anthropic.com',
          temperature: 0.7,
          maxTokens: 1000,
        },
        groq: {
          apiKey: '',
          model: 'llama3-70b-8192',
          baseUrl: 'https://api.groq.com/openai/v1',
          temperature: 0.7,
          maxTokens: 1000,
        },
        openai: {
          apiKey: '',
          model: 'gpt-4',
          baseUrl: 'https://api.openai.com/v1',
          temperature: 0.7,
          maxTokens: 1000,
        },
        gemini: {
          apiKey: '',
          model: 'gemini-1.5-flash',
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
          temperature: 0.7,
          maxTokens: 1000,
        },
      }
    };
    
    this.saveUserSettings(defaultSettings);
    return defaultSettings;
  }
}

// Create singleton instance
export const userSettingsService = new UserSettingsService();

// Export for use in components
export default userSettingsService;
