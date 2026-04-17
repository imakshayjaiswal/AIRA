'use strict';

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const aiProvider = require('./aiProvider');
const { SYSTEM_PROMPT, buildUserPrompt } = require('./promptBuilder');

// Valid enum values for post-processing validation
const VALID_CATEGORIES = ['urgent_action', 'needs_reply', 'fyi', 'promotional', 'noise'];
const VALID_URGENCY = ['critical', 'high', 'medium', 'low', 'none'];
const VALID_ACTIONS = ['reply', 'review', 'schedule', 'archive', 'delete'];
const VALID_SENDER_TYPES = ['boss', 'coworker', 'client', 'vendor', 'automated', 'marketing', 'unknown'];
const VALID_TIME_ESTIMATES = ['1min', '5min', '15min', '30min+'];

/**
 * Normalizes a value against a set of valid options.
 * Handles case-insensitivity, spaces vs underscores, etc.
 */
function normalizeValue(value, options) {
  if (typeof value !== 'string') return options[0];
  
  const normalized = value.toLowerCase().trim().replace(/\s+/g, '_');
  
  // Direct match
  if (options.includes(normalized)) return normalized;
  
  // Fuzzy match (contains)
  const match = options.find(opt => normalized.includes(opt) || opt.includes(normalized));
  return match || options[0];
}

/**
 * Parse and validate the AI-generated triage JSON.
 * Applies fallback defaults and fuzzy normalization.
 *
 * @param {string} rawJson - Raw string from the AI provider
 * @returns {object} - Validated triage result
 */
function parseAndValidate(rawJson) {
  // Extract the JSON block using string search instead of greedy regex (prevents ReDoS)
  let cleaned = rawJson.trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    logger.error('Failed to parse AI response as JSON', { raw: rawJson.substring(0, 500) });
    throw new Error('AI returned invalid JSON. Please retry.');
  }

  // Enforce schema with fuzzy normalization and safe defaults
  return {
    priority_score: clamp(parseInt(parsed.priority_score, 10) || 50, 0, 100),
    category: normalizeValue(parsed.category, VALID_CATEGORIES),
    urgency_level: normalizeValue(parsed.urgency_level, VALID_URGENCY),
    action: normalizeValue(parsed.action, VALID_ACTIONS),
    reason: typeof parsed.reason === 'string' ? parsed.reason : 'Unable to determine reason.',
    key_info: typeof parsed.key_info === 'string' ? parsed.key_info : 'No key information extracted.',
    estimated_time: normalizeValue(parsed.estimated_time, VALID_TIME_ESTIMATES),
    sender_type: normalizeValue(parsed.sender_type, VALID_SENDER_TYPES),
    requires_response: typeof parsed.requires_response === 'boolean' ? parsed.requires_response : false,
    deadline: parsed.deadline || null,
    red_flags: Array.isArray(parsed.red_flags) ? parsed.red_flags : [],
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Triage a single email.
 *
 * @param {object} email - Email object
 * @param {object} [options] - Optional overrides (model, temperature)
 * @returns {Promise<object>} - Full triage result
 */
async function triageEmail(email, options = {}) {
  const triageId = uuidv4();
  const startTime = Date.now();

  logger.info('Starting triage', {
    triageId,
    subject: email.subject?.substring(0, 80),
    from: email.from,
    ...options
  });

  const userPrompt = buildUserPrompt(email);
  const rawResponse = await aiProvider.complete(SYSTEM_PROMPT, userPrompt, 3, options);
  const result = parseAndValidate(rawResponse);

  const processingTimeMs = Date.now() - startTime;

  logger.info('Triage complete', {
    triageId,
    priorityScore: result.priority_score,
    category: result.category,
    processingTimeMs,
  });

  return {
    triageId,
    ...result,
    metadata: {
      processedAt: new Date().toISOString(),
      processingTimeMs,
      aiProvider: process.env.AI_PROVIDER,
      emailSubject: email.subject,
      emailFrom: email.from,
      model: options.model || 'default'
    },
  };
}

/**
 * Triage an array of emails in parallel with sliding window concurrency control.
 *
 * @param {object[]} emails - Array of email objects
 * @param {object} [options] - Optional overrides (model, temperature)
 * @returns {Promise<object>} - Summary + individual results
 */
async function triageBatch(emails, options = {}) {
  const batchId = uuidv4();
  const startTime = Date.now();
  const CONCURRENCY = 5;

  logger.info('Starting batch triage', { batchId, count: emails.length, ...options });

  const results = new Array(emails.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < emails.length) {
      const index = currentIndex++;
      const email = emails[index];
      
      try {
        const result = await triageEmail(email, options);
        results[index] = { index, success: true, result };
      } catch (err) {
        results[index] = {
          index,
          success: false,
          error: err.message || 'Unknown error',
        };
      }
    }
  }

  // Start concurrent workers
  const workers = Array.from({ length: Math.min(CONCURRENCY, emails.length) }, worker);
  await Promise.all(workers);

  const totalTimeMs = Date.now() - startTime;
  const successful = results.filter(r => r.success).map(r => r.result);
  const failedCount = results.filter(r => !r.success).length;

  const summary = {
    batchId,
    totalEmails: emails.length,
    processed: successful.length,
    failed: failedCount,
    totalTimeMs,
    avgTimeMs: successful.length > 0 ? Math.round(totalTimeMs / successful.length) : 0,
    breakdown: {
      critical: successful.filter((r) => r.urgency_level === 'critical').length,
      high: successful.filter((r) => r.urgency_level === 'high').length,
      medium: successful.filter((r) => r.urgency_level === 'medium').length,
      low: successful.filter((r) => r.urgency_level === 'low').length,
      noise: successful.filter((r) => r.urgency_level === 'none').length,
    },
    categories: {
      urgent_action: successful.filter((r) => r.category === 'urgent_action').length,
      needs_reply: successful.filter((r) => r.category === 'needs_reply').length,
      fyi: successful.filter((r) => r.category === 'fyi').length,
      promotional: successful.filter((r) => r.category === 'promotional').length,
      noise: successful.filter((r) => r.category === 'noise').length,
    },
  };

  logger.info('Batch triage complete', {
    batchId,
    processed: successful.length,
    failed: failedCount,
    totalTimeMs,
  });

  return { summary, results };
}

module.exports = { triageEmail, triageBatch };
