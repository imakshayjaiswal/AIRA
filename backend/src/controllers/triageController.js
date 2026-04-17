'use strict';

const triageService = require('../services/triageService');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * POST /api/triage
 * Triage a single email.
 */
async function triageEmail(req, res, next) {
  try {
    const { subject, from, body, to, cc, receivedAt, userEmail, senderName, isReply, threadLength, options = {} } = req.body;
    const email = { subject, from, body, to, cc, receivedAt, userEmail, senderName, isReply, threadLength };

    const result = await triageService.triageEmail(email, options);
    return sendSuccess(res, result, 'Email triaged successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/triage/batch
 * Triage multiple emails at once (up to 50).
 */
async function triageBatch(req, res, next) {
  try {
    const { emails, options = {} } = req.body;
    const result = await triageService.triageBatch(emails, options);
    return sendSuccess(res, result, `Batch triage complete: ${result.summary.processed}/${result.summary.totalEmails} processed`);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/health
 * Health check — confirms API is alive and AI provider is configured.
 */
async function healthCheck(req, res) {
  return sendSuccess(res, {
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    aiProvider: process.env.AI_PROVIDER,
    timestamp: new Date().toISOString(),
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    },
  }, 'ARIA API is running');
}

/**
 * GET /api/schema
 * Returns the expected request/response schema for front-end reference.
 */
async function getSchema(req, res) {
  return sendSuccess(res, {
    triage: {
      method: 'POST',
      path: '/api/triage',
      body: {
        required: {
          subject: 'string — email subject line',
          from: 'string — sender email address',
          body: 'string — email body content',
        },
        optional: {
          to: 'string — recipient email',
          cc: 'string[] — CC list',
          receivedAt: 'string — ISO 8601 datetime',
          userEmail: 'string — the user\'s own email (for domain matching)',
          senderName: 'string — display name of sender',
          isReply: 'boolean — whether this is a reply',
          threadLength: 'number — total messages in thread',
          options: {
            model: 'string — override the default AI model',
            temperature: 'number — override the generation temperature (0.0 - 1.0)',
          },
        },
      },
      response: {
        priority_score: 'number 0-100',
        category: 'urgent_action | needs_reply | fyi | promotional | noise',
        urgency_level: 'critical | high | medium | low | none',
        action: 'reply | review | schedule | archive | delete',
        reason: 'string — one sentence explanation',
        key_info: 'string — most important extracted info',
        estimated_time: '1min | 5min | 15min | 30min+',
        sender_type: 'boss | coworker | client | vendor | automated | marketing | unknown',
        requires_response: 'boolean',
        deadline: 'string | null',
        red_flags: 'string[]',
        metadata: {
          processedAt: 'timestamp',
          processingTimeMs: 'number',
          aiProvider: 'string',
          model: 'string',
        },
      },
    },
    batch: {
      method: 'POST',
      path: '/api/triage/batch',
      body: {
        emails: 'array of email objects (max 50), each using the triage schema above',
        options: 'same as the single triage options above',
      },
    },
    health: { method: 'GET', path: '/api/health' },
    schema: { method: 'GET', path: '/api/schema' },
  }, 'ARIA API Schema');
}

module.exports = { triageEmail, triageBatch, healthCheck, getSchema };
