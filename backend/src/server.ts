import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { apiRouter } from './routes/api';

const app = express();

// Security middleware
app.use(helmet());

// CORS - allow frontend origin
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Parse JSON bodies (limit to 5MB for audio data)
app.use(express.json({ limit: '5mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRouter);

// Start server
app.listen(config.port, () => {
  console.log(`🏥 Healthkinator backend running on http://localhost:${config.port}`);
  console.log(`   Health check: http://localhost:${config.port}/health`);
});

export default app;
