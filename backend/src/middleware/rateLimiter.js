'use strict';

const rateLimit = require('express-rate-limit');
const config = require('../config');
const { sendError } = require('../utils/response');

/**
 * General API rate limiter — applied to all routes.
 */
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      `Rate limit exceeded. You can make ${config.rateLimit.max} requests per ${
        config.rateLimit.windowMs / 60000
      } minutes.`,
      429
    );
  },
});

/**
 * Stricter limiter specifically for the AI triage endpoint.
 * AI calls are expensive — protect against abuse.
 */
const triageLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 20,              // Max 20 triage calls per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Triage rate limit exceeded. Max 20 requests per minute.',
      429
    );
  },
});

module.exports = { generalLimiter, triageLimiter };
