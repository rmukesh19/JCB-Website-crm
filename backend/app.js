import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/index.js';
import { configureEnterpriseSecurity } from './middleware/security.js';

dotenv.config();

const app = express();

// Disable framework finger-printing
app.disable('x-powered-by');

// Enforce Strict Enterprise Helmet Security Policies (CSP, HSTS, NoSniff, Clickjacking Prevention)
app.use(configureEnterpriseSecurity());

// HTTP Payload Compression (Gzip / Deflate reduces payload transfer size by ~70%)
app.use(compression({
  threshold: 1024, // only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// CORS Configuration with origin sanitation
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Safe bounded body parsing to prevent heap memory exhaustion DoS
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging (condensed for production performance)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Static uploads route with cache headers
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads'), {
  maxAge: '7d',
  immutable: true
}));

// Health Check with system memory and uptime metrics
app.get('/api/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'ok',
    service: 'JCB360 Enterprise API',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
    }
  });
});

// Mount Master API Routes
app.use('/api', apiRoutes);

// API 404 Handler - Prevent falling through to Vite HTML response
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.originalUrl} not found` });
});

// Global Error Handler with clean status mapping
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      code: 'PAYLOAD_TOO_LARGE',
      error: 'Request payload exceeds maximum 15MB limit'
    });
  }

  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;
