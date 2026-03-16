import { Router, Request, Response } from 'express';
import { generateResponse, generateSpeech } from '../services/geminiService';

export const apiRouter = Router();

// Status endpoint
apiRouter.get('/status', (_req: Request, res: Response) => {
  res.json({ status: 'Healthkinator API is running' });
});

// Chat endpoint — proxies symptom questions to Gemini
apiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
      res.status(400).json({ error: 'Missing or invalid "history" array in request body' });
      return;
    }

    const response = await generateResponse(history);
    res.json(response);
  } catch (error) {
    console.error('Error in /api/chat:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});

// Speech endpoint — proxies TTS to Gemini
apiRouter.post('/speech', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Missing or invalid "text" string in request body' });
      return;
    }

    const audio = await generateSpeech(text);
    res.json({ audio });
  } catch (error) {
    console.error('Error in /api/speech:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
});
