import { Router, Request, Response } from 'express';
import { generateResponse, generateSpeech } from '../services/geminiService';
import { getReports, saveReport, clearReports, getUserProfile, saveUserProfile } from '../services/storageService';

export const apiRouter = Router();

// Status endpoint
apiRouter.get('/status', (_req: Request, res: Response) => {
  res.json({ status: 'Healthkinator API is running' });
});

// ──────────────────────────────────────────────
// AI Endpoints
// ──────────────────────────────────────────────

// Chat endpoint — proxies symptom questions to Gemini (now with combined audio)
apiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
      res.status(400).json({ error: 'Missing or invalid "history" array in request body' });
      return;
    }

    const { generateCombinedResponse } = await import('../services/geminiService');
    const response = await generateCombinedResponse(history);
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

// ──────────────────────────────────────────────
// Reports Endpoints
// ──────────────────────────────────────────────

// Get all reports
apiRouter.get('/reports', (_req: Request, res: Response) => {
  try {
    const reports = getReports();
    res.json(reports);
  } catch (error) {
    console.error('Error in GET /api/reports:', error);
    res.status(500).json({ error: 'Failed to retrieve reports' });
  }
});

// Save a new report
apiRouter.post('/reports', (req: Request, res: Response) => {
  try {
    const report = req.body;

    if (!report || !report.id || !report.diagnosis) {
      res.status(400).json({ error: 'Invalid report data' });
      return;
    }

    saveReport(report);
    res.status(201).json({ message: 'Report saved successfully' });
  } catch (error) {
    console.error('Error in POST /api/reports:', error);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// Clear all reports
apiRouter.delete('/reports', (_req: Request, res: Response) => {
  try {
    clearReports();
    res.json({ message: 'All reports cleared' });
  } catch (error) {
    console.error('Error in DELETE /api/reports:', error);
    res.status(500).json({ error: 'Failed to clear reports' });
  }
});

// ──────────────────────────────────────────────
// Profile Endpoints
// ──────────────────────────────────────────────

// Get user profile
apiRouter.get('/profile', (_req: Request, res: Response) => {
  try {
    const profile = getUserProfile();
    res.json(profile);
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// Update user profile
apiRouter.put('/profile', (req: Request, res: Response) => {
  try {
    const profile = req.body;

    if (!profile || !profile.name) {
      res.status(400).json({ error: 'Invalid profile data' });
      return;
    }

    saveUserProfile(profile);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
