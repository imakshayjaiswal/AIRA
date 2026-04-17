'use strict';

require('dotenv').config();

const requiredEnvVars = ['AI_PROVIDER'];

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const provider = process.env.AI_PROVIDER;
  if (!['openai', 'gemini', 'nvidia'].includes(provider)) {
    throw new Error(`AI_PROVIDER must be "openai", "gemini" or "nvidia", got: "${provider}"`);
  }

  if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required when AI_PROVIDER=openai');
  }
  if (provider === 'gemini' && !process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required when AI_PROVIDER=gemini');
  }
  if (provider === 'nvidia' && !process.env.NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY is required when AI_PROVIDER=nvidia');
  }
}

validateEnv();

module.exports = {
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDev: (process.env.NODE_ENV || 'development') === 'development',
  },

  ai: {
    provider: process.env.AI_PROVIDER,
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    },
    nvidia: {
      apiKey: process.env.NVIDIA_API_KEY,
      model: process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct',
    },
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || '*')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
