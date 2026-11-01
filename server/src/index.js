import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if available, otherwise fallback to .env
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config({ path: envPath });
}

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === CLIENT_URL ||
        origin.startsWith('http://localhost:') ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Mount API routes under /api and root (supports both local server and Vercel serverless rewrites)
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Refer & Win Location Verification API is running.',
    healthCheck: '/api/health',
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Express server
if (!process.env.VERCEL && !process.env.CLOUDFLARE_WORKER && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Refer & Win Server running on http://localhost:${PORT}`);
    console.log(`📡 Accepting client connections from: ${CLIENT_URL}`);
  });
}

export default app;
