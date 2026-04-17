'use strict';

const OpenAI = require('openai');
const config = require('../../config');
const logger = require('../../utils/logger');

let client = null;

/**
 * Lazily initializes the OpenAI client.
 * We don't create it at module load so the app doesn't crash
 * if the user picks Gemini instead.
 */
function getClient() {
  if (!client) {
    client = new OpenAI({ apiKey: config.ai.openai.apiKey });
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
 * Calls OpenAI chat completions with the given prompts.
 *
 * @param {string} systemPrompt  - ARIA system instructions
 * @param {string} userPrompt    - The formatted email content
 * @param {number} [maxRetries]  - Maximum retry attempts
 * @param {object} [options]     - Dynamic overrides
 * @returns {Promise<string>}    - Raw AI response text
 */
async function complete(systemPrompt, userPrompt, maxRetries = 3, options = {}) {
  const openai = getClient();
  const model = options.model || config.ai.openai.model;

  logger.debug('OpenAI request', { model, promptLength: userPrompt.length });

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: options.temperature !== undefined ? options.temperature : 0.1,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      });

      const durationMs = Date.now() - startTime;
      const responseText = completion.choices[0]?.message?.content?.trim();

      logger.info('OpenAI response received', {
        model,
        durationMs,
        attempt,
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
      });

      if (!responseText) {
        throw new Error('OpenAI returned empty response');
      }

      return responseText;
    } catch (err) {
      lastError = err;

      // Retry on 429 Rate Limit or 5xx Server Errors
      const isRetryable = err.status === 429 || (err.status >= 500 && err.status < 600) || err.message?.includes('429');

      if (!isRetryable || attempt === maxRetries) {
        logger.error(`OpenAI request failed (attempt ${attempt}/${maxRetries})`, {
          error: err.message,
          retryable: isRetryable,
        });
        throw err;
      }

      const delayMs = Math.min(1000 * Math.pow(2, attempt), 30000);
      
      logger.warn(`OpenAI rate limited/error. Retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`, {
        model,
        delayMs,
      });

      await sleep(delayMs);
    }
  }

  throw lastError;
}



module.exports = { complete };
