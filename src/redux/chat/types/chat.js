// Chat Types - converted to JavaScript
// Note: These are just for reference, actual types are not enforced in JS

export const ChatMessage = {
  // id: string;
  // role: 'user' | 'assistant';
  // text: string | VoiceMessage;
  // provider?: string;
  // model?: string;
  // conversationId?: string;
  // timestamp?: string;
  // tokensUsed?: number;
  // responseTimeMs?: number;
  // error?: string;
};

export const VoiceMessage = {
  // type: 'voice';
  // url: string;
  // duration: number;
};

export const ChatRequest = {
  // message: string;
  // provider: string;
  // model?: string;
  // conversationId?: string;
  // apiKey?: string;
  // baseUrl?: string;
  // temperature?: number;
  // maxTokens?: number;
};

export const ChatResponse = {
  // response: string;
  // provider: string;
  // model: string;
  // conversationId: string;
  // timestamp: string;
  // tokensUsed?: number;
  // responseTimeMs?: number;
  // error?: string;
};

export const Provider = {
  // name: string;
  // displayName: string;
  // description: string;
  // availableModels: string[];
  // isAvailable: boolean;
  // status: string;
};

export const ChatState = {
  // messages: ChatMessage[];
  // providers: Provider[];
  // selectedProvider: string;
  // selectedModel: string;
  // isLoading: boolean;
  // error: string | null;
  // currentConversationId: string;
};

export const RootState = {
  // chat: ChatState;
};
