import { GeminiResponse, Content } from '../types';

const API_BASE = '/api';

export const generateResponse = async (history: Content[]): Promise<GeminiResponse & { audio?: string }> => {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
    throw new Error(errorData.error || `Server error: ${res.status}`);
  }

  const data = await res.json();
  return data;
};

export const generateSpeech = async (text: string): Promise<string> => {
  const res = await fetch(`${API_BASE}/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
    throw new Error(errorData.error || `Server error: ${res.status}`);
  }

  const data = await res.json();
  if (!data.audio) {
    throw new Error('No audio data received from server');
  }
  return data.audio;
};
