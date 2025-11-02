
export enum GameState {
  Welcome,
  Playing,
  Result,
}

export interface Diagnosis {
  condition: string;
  report: string;
  confidence: number;
}

export interface GeminiResponse {
  type: 'question' | 'diagnosis';
  text: string;
  condition?: string;
  confidence?: number;
}

export type UserAnswer = 'Yes' | 'No' | "Don't Know" | 'Probably' | 'Probably not';
