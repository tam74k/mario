
export interface ServiceItem {
  name: string;
  price: number | string;
  category: string;
}

export type MessageRole = 'user' | 'model';

export interface ChatMessage {
  role: MessageRole;
  text: string;
  timestamp: Date;
}

export enum AppView {
  LANDING = 'landing',
  SERVICES = 'services',
  CHAT = 'chat',
  VOICE = 'voice'
}
