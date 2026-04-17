'use strict';

const config = require('../../config');
const logger = require('../../utils/logger');

/**
 * Calls NVIDIA NIM API using fetch.
 * Includes automatic retry with exponential backoff for rate-limit errors (429).
 *
 * @param {string} systemPrompt  - ARIA system instructions
 * @param {string} userPrompt    - The formatted email content
 * @param {number} [maxRetries]  - Maximum retry attempts
 * @param {object} [options]     - Per-request overrides (model, temperature)
 * @returns {Promise<string>}    - Raw AI response text
 */
async function complete(systemPrompt, userPrompt, maxRetries = 3, options = {}) {
  const modelName = options.model || config.ai.nvidia.model;
  const apiKey = config.ai.nvidia.apiKey;
  const invokeUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';

  logger.debug('NVIDIA NIM request', { model: modelName, promptLength: userPrompt.length });

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const payload = {
    model: modelName,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 800,
    temperature: options.temperature !== undefined ? options.temperature : 0.1,
    top_p: 0.95,
    stream: false,
    response_format: { type: 'json_object' }
  };

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const response = await fetch(invokeUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`NVIDIA API Error status ${response.status}: ${errorText}`);
        error.status = response.status;
        throw error;
      }

      const jsonResult = await response.json();
      
      const responseText = jsonResult.choices?.[0]?.message?.content?.trim();

      const durationMs = Date.now() - startTime;

      logger.info('NVIDIA NIM response received', {
        model: modelName,
        durationMs,
        attempt,
        promptTokens: jsonResult.usage?.prompt_tokens,
        completionTokens: jsonResult.usage?.completion_tokens,
      });

      if (!responseText) {
        throw new Error('NVIDIA NIM returned empty response');
      }

      return responseText;
    } catch (err) {
      lastError = err;

      // Only retry on rate-limit (429) errors or 5xx server errors
      const isRetryable = err.status === 429 || (err.status >= 500 && err.status <= 599);

      if (!isRetryable || attempt === maxRetries) {
        logger.error(`NVIDIA API request failed (attempt ${attempt}/${maxRetries})`, {
          error: err.message,
          retryable: isRetryable,
        });
        throw err;
      }

      const delayMs = Math.min(1000 * Math.pow(2, attempt), 30000); // 2s, 4s, 8s... max 30s

      logger.warn(`NVIDIA API error. Retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`, {
        model: modelName,
        delayMs,
      });

      // Sleep helper
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

module.exports = { complete };
