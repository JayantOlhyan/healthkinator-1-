import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  dataDir: path.resolve(__dirname, '../data'),
};

if (!config.geminiApiKey || config.geminiApiKey === 'PLACEHOLDER_API_KEY') {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set in backend/.env. AI features will not work.');
}
