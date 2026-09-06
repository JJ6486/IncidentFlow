import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prisma.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials:true,
    })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'IncidentFlow API is running',
  });
});

app.get('/api/db-health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: 'Database connection is healthy',
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;