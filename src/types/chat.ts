export type ChatMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
};

export type ChatContext = {
  openPos: any[];
  pos: any[];
  landingRates: any[];
  universalPO: any[];
};

export type GeminiConfig = {
  apiKey: string;
  model: string;
};

export type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
};
