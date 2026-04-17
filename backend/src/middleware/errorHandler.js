'use strict';

const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

/**
 * Central error-handling middleware.
 * Must be registered LAST in the Express middleware chain.
 * Catches both operational errors and programmer errors.
 */
const errorHandler = (err, req, res, next) => {
  // Log the full error with context
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    requestId: req.id,
  });

  // Handle specific known error types
  if (err.name === 'ValidationError') {
    return sendError(res, err.message, 400, err.details || null);
  }

  if (err.status === 429 || err.type === 'RateLimitError') {
    return sendError(res, 'Too many requests. Please slow down.', 429);
  }

  // OpenAI / Gemini / NVIDIA API errors
  if (err.status === 401 || err.message?.includes('API key') || err.message?.includes('authentication')) {
    return sendError(res, 'AI provider authentication failed. Check your configuration.', 503);
  }

  if (err.status === 429 || err.message?.includes('quota') || err.message?.includes('limit')) {
    return sendError(res, 'AI provider rate limit or quota exceeded. Try again later.', 503);
  }

  // Catch-all: never leak stack traces in production
  const isDev = process.env.NODE_ENV === 'development';
  // Check if it's an AI error to be extra careful even in dev
  const isAiError = err.message?.toLowerCase().includes('nvidia') || 
                    err.message?.toLowerCase().includes('gemini') || 
                    err.message?.toLowerCase().includes('openai');

  return sendError(
    res,
    (isDev && !isAiError) ? err.message : 'An unexpected error occurred.',
    err.status || 500,
    (isDev && !isAiError) ? { stack: err.stack } : null
  );
};

/** 404 handler — must be registered AFTER all routes */
const notFoundHandler = (req, res) => {
  return sendError(res, `Route ${req.method} ${req.originalUrl} not found.`, 404);
};

module.exports = { errorHandler, notFoundHandler };
