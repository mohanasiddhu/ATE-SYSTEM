import express from 'express';
import cors from 'cors';
import path from 'path';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

export function createServer() {
  const app = express();

  // Basic Middleware
  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(requestLogger);

  // Serve generated outputs (evidence, crops, reports, videos)
  app.use('/outputs', express.static(path.resolve('./outputs')));
  app.use('/assets', express.static(path.resolve('./public/assets')));
  app.use('/frontend/assets', express.static(path.resolve('./public/assets')));

  // Mount API Endpoints under /api
  app.use('/api', apiRouter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'HEALTHY',
      service: 'AI Traffic Enforcement Backend',
      version: '2.4.0',
      database: 'CONNECTED',
      aiEngine: 'YOLOv8 + ByteTrack + LPRNet Active',
      timestamp: new Date().toISOString()
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}

export default createServer;
