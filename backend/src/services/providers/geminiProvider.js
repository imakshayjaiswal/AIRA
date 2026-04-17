'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config');
const logger = require('../../utils/logger');

let client = null;

/**
 * Lazily initializes the Gemini client.
 */
function getClient() {
  if (!client) {
    client = new GoogleGenerativeAI(config.ai.gemini.apiKey);
  }
  return client;
}

/**
 * Sleeps for the given milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls Google Gemini with the given prompts.
 * Includes automatic retry with exponential backoff for rate-limit errors (429).
 *
 * @param {string} systemPrompt  - ARIA system instructions
 * @param {string} userPrompt    - The formatted email content
 * @param {number} [maxRetries]  - Maximum retry attempts
 * @param {object} [options]     - Dynamic overrides
 * @returns {Promise<string>}    - Raw AI response text
 */
async function complete(systemPrompt, userPrompt, maxRetries = 3, options = {}) {
  const genAI = getClient();
  const modelName = options.model || config.ai.gemini.model;

  logger.debug('Gemini request', { model: modelName, promptLength: userPrompt.length });

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: options.temperature !== undefined ? options.temperature : 0.1,
      maxOutputTokens: 800,
      responseMimeType: 'application/json',
    },
  });

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();

      const result = await model.generateContent(userPrompt);
      const response = result.response;
      const responseText = response.text()?.trim();

      const durationMs = Date.now() - startTime;

      logger.info('Gemini response received', {
        model: modelName,
        durationMs,
        attempt,
        promptTokens: response.usageMetadata?.promptTokenCount,
        completionTokens: response.usageMetadata?.candidatesTokenCount,
      });

      if (!responseText) {
        throw new Error('Gemini returned empty response');
      }

      return responseText;
    } catch (err) {
      lastError = err;

      // Only retry on rate-limit (429) errors
      const isRateLimit = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('Too Many Requests');

      if (!isRateLimit || attempt === maxRetries) {
        logger.error(`Gemini request failed (attempt ${attempt}/${maxRetries})`, {
          error: err.message,
          retryable: isRateLimit,
        });
        throw err;
      }

      // Extract retry delay from error if available, otherwise exponential backoff
      let delayMs;
      const retryMatch = err.message?.match(/retry in ([\d.]+)s/i);
      if (retryMatch) {
        delayMs = Math.ceil(parseFloat(retryMatch[1]) * 1000) + 1000; // Add 1s buffer
      } else {
        delayMs = Math.min(1000 * Math.pow(2, attempt), 30000); // 2s, 4s, 8s... max 30s
      }

      logger.warn(`Gemini rate limited. Retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`, {
        model: modelName,
        delayMs,
      });

      await sleep(delayMs);
    }
  }

  throw lastError;
}

module.exports = { complete };
