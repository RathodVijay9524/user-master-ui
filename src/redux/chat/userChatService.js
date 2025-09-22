// User-specific chat service to handle user isolation for chat messages
import { store } from '../store';

class UserChatService {
  constructor() {
    this.currentUserId = null;
  }

  // Set current user ID
  setCurrentUser(userId) {
    this.currentUserId = userId;
  }

  // Clear current user (on logout)
  clearCurrentUser() {
    this.currentUserId = null;
  }

  // Generate user-specific localStorage key
  getUserStorageKey(key) {
    return this.currentUserId ? `user_${this.currentUserId}_${key}` : key;
  }

  // Save user-specific chat messages
  saveUserChatMessages(messages) {
    if (!this.currentUserId) return;
    
    const key = this.getUserStorageKey('chatMessages');
    try {
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save user chat messages:', error);
    }
  }

  // Load user-specific chat messages
  loadUserChatMessages() {
    if (!this.currentUserId) return [];
    
    const key = this.getUserStorageKey('chatMessages');
    try {
      const messages = localStorage.getItem(key);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error('Failed to load user chat messages:', error);
      return [];
    }
  }

  // Save user-specific conversation ID
  saveUserConversationId(conversationId) {
    if (!this.currentUserId) return;
    
    const key = this.getUserStorageKey('conversationId');
    try {
      localStorage.setItem(key, conversationId);
    } catch (error) {
      console.error('Failed to save user conversation ID:', error);
    }
  }

  // Load user-specific conversation ID
  loadUserConversationId() {
    if (!this.currentUserId) return `conv-${Date.now()}`;
    
    const key = this.getUserStorageKey('conversationId');
    try {
      const conversationId = localStorage.getItem(key);
      return conversationId || `conv-${Date.now()}`;
    } catch (error) {
      console.error('Failed to load user conversation ID:', error);
      return `conv-${Date.now()}`;
    }
  }

  // Add message to user's chat history
  addUserMessage(message) {
    if (!this.currentUserId) return;
    
    const messages = this.loadUserChatMessages();
    messages.push(message);
    this.saveUserChatMessages(messages);
  }

  // Clear user's chat messages
  clearUserChatMessages() {
    if (!this.currentUserId) return;
    
    const key = this.getUserStorageKey('chatMessages');
    localStorage.removeItem(key);
    
    // Reset conversation ID
    this.saveUserConversationId(`conv-${Date.now()}`);
  }

  // Clear all user data (on logout)
  clearUserData() {
    if (!this.currentUserId) return;
    
    const keys = ['chatMessages', 'conversationId'];
    keys.forEach(key => {
      const userKey = this.getUserStorageKey(key);
      localStorage.removeItem(userKey);
    });
  }

  // Initialize user chat data
  initializeUserChat(userId) {
    if (!userId) return;
    
    this.setCurrentUser(userId);
    
    // Initialize with empty chat if none exists
    const existingMessages = this.loadUserChatMessages();
    if (existingMessages.length === 0) {
      this.saveUserChatMessages([]);
    }
    
    // Initialize conversation ID if none exists
    const existingConversationId = this.loadUserConversationId();
    if (!existingConversationId || existingConversationId === `conv-${Date.now()}`) {
      this.saveUserConversationId(`conv-${Date.now()}`);
    }
  }
}

// Create singleton instance
export const userChatService = new UserChatService();

// Export for use in components
export default userChatService;
