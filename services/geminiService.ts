import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from '../constants';
// Fix: Consolidate type imports to use the central 'types.ts' file for better consistency.
import { GeminiResponse, Content } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const generateResponse = async (history: Content[]): Promise<GeminiResponse> => {
  const aiInstance = getAI();
  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });
    
    const jsonString = response.text.trim();

    // Basic validation to ensure it's a JSON string
    if (!jsonString.startsWith('{') || !jsonString.endsWith('}')) {
        throw new Error("Invalid JSON response from API");
    }

    const parsedResponse = JSON.parse(jsonString);
    
    // Validate required fields
    if (!parsedResponse.type || !parsedResponse.text) {
        throw new Error("Malformed JSON response: missing 'type' or 'text'");
    }

    return parsedResponse as GeminiResponse;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get next step from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  const aiInstance = getAI();
  try {
    const response = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say it clearly: ${text}` }] }],
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
      throw new Error("No audio data received from API.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating speech.");
  }
};