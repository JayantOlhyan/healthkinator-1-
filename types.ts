// Content type definition (previously imported from @google/genai)
export interface Content {
  role: string;
  parts: { text: string }[];
}

export enum GameState {
  Welcome,
  Playing,
  PastReports,
  Settings,
}

export interface Diagnosis {
  condition: string;
  report: string;
  confidence: number;
  suggestions?: string[];
}

export interface GeminiResponse {
  type: 'question' | 'diagnosis';
  text: string;
  condition?: string;
  confidence?: number;
  suggestions?: string[];
}

export type UserAnswer = 'Yes' | 'No' | "I don't know";

export type AvatarId = 'default' | 'avatar1' | 'avatar2' | 'avatar3' | 'avatar4' | 'avatar5' | 'avatar6' | 'avatar7';

export interface UserProfile {
  name: string;
  avatar: AvatarId;
}

export interface Report {
  id: string;
  date: string;
  diagnosis: Diagnosis;
  history: Content[];
}