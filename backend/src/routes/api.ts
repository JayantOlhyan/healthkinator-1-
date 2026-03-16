import { Router } from 'express';

export const apiRouter = Router();

// Placeholder — endpoints will be added in subsequent commits
apiRouter.get('/status', (_req, res) => {
  res.json({ status: 'Healthkinator API is running' });
});
