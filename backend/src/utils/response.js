'use strict';

/**
 * Standardized API response helpers.
 * All responses share the same envelope shape so the frontend
 * only needs to handle ONE format regardless of success/error.
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {object} data      - Payload to return
 * @param {string} message   - Human-readable success message
 * @param {number} [status]  - HTTP status code (default 200)
 */
const sendSuccess = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message    - Human-readable error message
 * @param {number} [status]   - HTTP status code (default 500)
 * @param {object} [details]  - Optional validation detail or debugging info
 */
const sendError = (res, message = 'Internal server error', status = 500, details = null) => {
  const body = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    body.details = details;
  }

  return res.status(status).json(body);
};

module.exports = { sendSuccess, sendError };
