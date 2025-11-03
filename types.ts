// Fix: Re-export 'Content' type to resolve import error in other components.
// Fix: Correctly import and re-export `Content` type to make it available within this module.
import type { Content } from '@google/genai';
export type { Content };

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