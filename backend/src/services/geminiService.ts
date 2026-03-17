import { GoogleGenAI, Modality } from '@google/genai';
import { config } from '../config';

// System instruction and response schema (mirrored from frontend constants.ts)
const MAX_QUESTIONS = 10;

const SYSTEM_INSTRUCTION = `You are Healthkinator, an expert AI symptom checker designed to help users identify potential health issues through a series of simple questions. Your personality is like the game Akinator: engaging, smart, and focused on deduction.

Your task is to guide the user towards a probable diagnosis. Follow these rules strictly:
1.  **Ask One Question at a Time**: Each of your responses must be a single, clear, and easy-to-understand question related to symptoms. Avoid medical jargon.
2.  **Adaptive Questioning**: Based on the user's answers ('Yes', 'No', "I don't know"), adapt your next question to narrow down the possibilities.
3.  **JSON Output ONLY**: Your entire response MUST be a valid JSON object that conforms to the provided schema. Do not output any text outside of the JSON structure.
4.  **Game Flow**:
    *   Start with broad, common symptoms.
    *   After 5 to ${MAX_QUESTIONS} questions, if you have a high-confidence guess, change the 'type' in your JSON response to 'diagnosis'.
    *   If you're still unsure after ${MAX_QUESTIONS} questions, make your best guess.
5.  **Diagnosis Content**: When you provide a diagnosis:
    *   'condition' should be the name of the probable medical condition.
    *   'text' should be a brief report explaining the conclusion based on the symptoms and a strong, clear disclaimer. The disclaimer must state: "This is a preliminary assessment based on an AI model and is NOT a substitute for professional medical advice. Please consult a qualified healthcare provider for an accurate diagnosis and treatment."
    *   'confidence' should be a number between 0 and 100 representing your confidence level.
    *   'suggestions' should be an array of 2-4 brief, actionable next steps or recommendations. Examples: "Rest and stay hydrated.", "Consider using over-the-counter pain relievers as directed.", "Schedule an appointment with a healthcare provider.". These should be non-prescriptive.
`;

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
