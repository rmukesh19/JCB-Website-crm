import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Static uploads route
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'JCB360 Enterprise API', timestamp: new Date() });
});

// Mount Master API Routes
app.use('/api', apiRoutes);

// API 404 Handler - Prevent falling through to Vite HTML response
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;
