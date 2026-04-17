'use strict';

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const config = require('./config');
const logger = require('./utils/logger');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// ─────────────────────────────────────
// Express App Configuration
// ─────────────────────────────────────
const app = express();

// Security headers (relaxed for serving frontend)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS — allow front-end origins from env
const corsOptions = {
  origin: config.cors.origins.includes('*') ? true : config.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Gzip compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Request logging — dev format in development, combined in prod
app.use(morgan(config.server.isDev ? 'dev' : 'combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// ─────────────────────────────────────
// Serve Frontend Static Files
// ─────────────────────────────────────
const frontendPath = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendPath));

// Global rate limiter (API only)
app.use('/api', generalLimiter);

// ─────────────────────────────────────
// API Routes
// ─────────────────────────────────────
app.use('/api', routes);

// SPA fallback — serve index.html for any non-API route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ─────────────────────────────────────
// Error Handling (MUST be last)
// ─────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─────────────────────────────────────
// Start Server
// ─────────────────────────────────────
const PORT = config.server.port;

app.listen(PORT, () => {
  logger.info('═══════════════════════════════════════════════');
  logger.info(`  ARIA Email Triage API`);
  logger.info(`  Environment : ${config.server.nodeEnv}`);
  logger.info(`  Port        : ${PORT}`);
  logger.info(`  AI Provider : ${config.ai.provider}`);
  logger.info(`  API Base    : http://localhost:${PORT}/api`);
  logger.info(`  Health      : http://localhost:${PORT}/api/health`);
  logger.info(`  Schema      : http://localhost:${PORT}/api/schema`);
  logger.info('═══════════════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully…');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down…');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', { reason: reason?.message || reason });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception — shutting down', { error: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = app; // Export for testing with supertest
