'use strict';

const config = require('../config');
const logger = require('../utils/logger');

/**
 * AI Provider factory — selects the correct provider module based on config.
 * This is a simple strategy pattern: swap providers without touching consumers.
 */

let provider = null;

function getProvider() {
  if (!provider) {
    const name = config.ai.provider;
    logger.info(`Initializing AI provider: ${name}`);

    switch (name) {
      case 'openai':
        provider = require('./providers/openaiProvider');
        break;
      case 'gemini':
        provider = require('./providers/geminiProvider');
        break;
      case 'nvidia':
        provider = require('./providers/nvidiaProvider');
        break;
      default:
        throw new Error(`Unknown AI provider: "${name}". Use "openai", "gemini", or "nvidia".`);
    }
  }
  return provider;
}

/**
 * Send a system + user prompt to the configured AI provider.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {number} [maxRetries]
 * @param {object} [options]
 * @returns {Promise<string>} - Raw response text (should be JSON)
 */
async function complete(systemPrompt, userPrompt, maxRetries = 3, options = {}) {
  return getProvider().complete(systemPrompt, userPrompt, maxRetries, options);
}

module.exports = { complete };
