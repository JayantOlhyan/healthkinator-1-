import { GoogleGenAI, Modality } from '@google/genai';
import { config } from '../config';

// System instruction and response schema (mirrored from frontend constants.ts)
const MAX_QUESTIONS = 10;

const SYSTEM_INSTRUCTION = `You are Healthkinator, the world's most capable AI medical deduction engine. Your goal: identify the user's condition in under 10 questions.
Rules:
1. **Smarter Deduction**: Ask high-impact questions first. If 'fever' is common, check if it's high-grade or intermittent to differentiate.
2. **Personality**: Be sharp, witty, and confident like Akinator. Use phrases like "I see...", "Interesting...", or "Let me think..." (within the JSON 'text').
3. **One at a Time**: Only one question per response. Keep it short and understandable.
4. **JSON ONLY**: strictly follow schema. No text outside JSON.
5. **Logic**:
   - Start broad, then drill down fast.
   - After 5+ questions, if confidence > 70%, give 'diagnosis'.
   - At question 10, ALWAYS give 'diagnosis'.
6. **Disclaimer**: Every diagnosis text MUST end with: "PRELIMINARY ASSESSMENT ONLY. NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE. CONSULT A DOCTOR IMMEDIATELY FOR CONCERNS."`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT' as const,
  properties: {
    type: {
      type: 'STRING' as const,
      enum: ['question', 'diagnosis'],
      description: "Specifies if the response is a question for the user or a final diagnosis."
    },
    text: {
      type: 'STRING' as const,
      description: "If 'type' is 'question', this is the next question for the user. If 'type' is 'diagnosis', this is the detailed report and disclaimer."
    },
    condition: {
      type: 'STRING' as const,
      description: "The name of the probable medical condition. ONLY included if 'type' is 'diagnosis'."
    },
    confidence: {
      type: 'NUMBER' as const,
      description: "A confidence score from 0 to 100. ONLY included if 'type' is 'diagnosis'."
    },
    suggestions: {
      type: 'ARRAY' as const,
      description: "A list of actionable suggestions for the user. ONLY included if 'type' is 'diagnosis'.",
      items: {
        type: 'STRING' as const,
      }
    }
  },
  required: ['type', 'text']
};

interface GeminiResponse {
  type: 'question' | 'diagnosis';
  text: string;
  condition?: string;
  confidence?: number;
  suggestions?: string[];
}

interface Content {
  role: string;
  parts: { text: string }[];
}

let ai: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!ai) {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return ai;
};

export const generateResponse = async (history: Content[]): Promise<GeminiResponse> => {
  const aiInstance = getAI();
  
  const response = await aiInstance.models.generateContent({
    model: 'gemini-flash-latest',
    contents: history,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const jsonString = response.text?.trim();
  if (!jsonString || !jsonString.startsWith('{') || !jsonString.endsWith('}')) {
    throw new Error('Invalid JSON response from Gemini API');
  }

  const parsed = JSON.parse(jsonString);
  if (!parsed.type || !parsed.text) {
    throw new Error("Malformed response: missing 'type' or 'text'");
  }

  return parsed as GeminiResponse;
};

export const generateSpeech = async (text: string): Promise<string> => {
  const aiInstance = getAI();

  const response = await aiInstance.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error('No audio data received from Gemini API');
  }

  return base64Audio;
};
