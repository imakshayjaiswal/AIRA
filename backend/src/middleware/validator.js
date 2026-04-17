'use strict';

const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Validation rules for the email triage endpoint.
 * Mirrors expected email fields; all optional fields are enriching context.
 */
const triageEmailRules = [
  body('subject')
    .trim()
    .notEmpty().withMessage('subject is required')
    .isLength({ max: 500 }).withMessage('subject must be ≤ 500 characters'),

  body('from')
    .trim()
    .notEmpty().withMessage('from (sender email) is required')
    .isEmail().withMessage('from must be a valid email address'),

  body('body')
    .trim()
    .notEmpty().withMessage('email body is required')
    .isLength({ max: 10000 }).withMessage('email body must be ≤ 10,000 characters'),

  // Optional enriching context
  body('to')
    .optional()
    .trim()
    .isEmail().withMessage('to must be a valid email address'),

  body('cc')
    .optional()
    .isArray().withMessage('cc must be an array of email strings'),

  body('receivedAt')
    .optional()
    .isISO8601().withMessage('receivedAt must be a valid ISO 8601 date string'),

  body('userEmail')
    .optional()
    .trim()
    .isEmail().withMessage('userEmail must be a valid email address'),

  body('senderName')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('senderName must be ≤ 200 characters'),

  body('isReply')
    .optional()
    .isBoolean().withMessage('isReply must be a boolean'),

  body('threadLength')
    .optional()
    .isInt({ min: 1 }).withMessage('threadLength must be a positive integer'),

  // Options validation
  body('options.model')
    .optional()
    .isString().withMessage('options.model must be a string representing the model name'),
    
  body('options.temperature')
    .optional()
    .isFloat({ min: 0, max: 2 }).withMessage('options.temperature must be a float between 0 and 2'),
];

/**
 * Middleware that reads validation results and short-circuits with 400
 * if any rule failed. Aggregates ALL errors so front-end gets full picture.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      'Validation failed. Check the details field for specific issues.',
      400,
      errors.array().map(({ path, msg }) => ({ field: path, message: msg }))
    );
  }
  next();
};

/**
 * Batch validation rules — array of emails
 */
const batchTriageRules = [
  body('emails')
    .isArray({ min: 1, max: 50 }).withMessage('emails must be a non-empty array of up to 50 items'),
  body('emails.*.subject')
    .trim()
    .notEmpty().withMessage('each email must have a subject'),
  body('emails.*.from')
    .trim()
    .notEmpty().withMessage('each email must have a from field')
    .isEmail().withMessage('each from must be a valid email'),
  body('emails.*.body')
    .trim()
    .notEmpty().withMessage('each email must have a body'),
    
  // Options validation (same as above for batch overrides)
  body('options.model')
    .optional()
    .isString().withMessage('options.model must be a string representing the model name'),
    
  body('options.temperature')
    .optional()
    .isFloat({ min: 0, max: 2 }).withMessage('options.temperature must be a float between 0 and 2'),
];

module.exports = { triageEmailRules, batchTriageRules, handleValidationErrors };
