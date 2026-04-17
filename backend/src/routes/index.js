'use strict';

const { Router } = require('express');
const controller = require('../controllers/triageController');
const gmailController = require('../controllers/gmailController');
const authController = require('../controllers/authController');
const { triageEmailRules, batchTriageRules, handleValidationErrors } = require('../middleware/validator');
const { triageLimiter } = require('../middleware/rateLimiter');

const router = Router();

// ─────────────────────────────────────
// Health & Info
// ─────────────────────────────────────
router.get('/health', controller.healthCheck);
router.get('/schema', controller.getSchema);

// ─────────────────────────────────────
// Auth (DB based)
// ─────────────────────────────────────
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// ─────────────────────────────────────
// Admin: DB Viewer (development only)
// ─────────────────────────────────────
router.get('/admin/users', (req, res) => {
    const db = require('../config/database');
    db.all(
        'SELECT email, context_workday, context_senders, context_focus, created_at FROM users',
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                success: true,
                note: 'Passwords and App Keys are hidden.',
                count: rows.length,
                users: rows
            });
        }
    );
});



// ─────────────────────────────────────
// Email Triage
// ─────────────────────────────────────
router.post(
  '/triage',
  triageLimiter,
  triageEmailRules,
  handleValidationErrors,
  controller.triageEmail
);

router.post(
  '/triage/batch',
  triageLimiter,
  batchTriageRules,
  handleValidationErrors,
  controller.triageBatch
);

// Real IMAP Fetch & Triage
router.post('/gmail/fetch-triage', gmailController.fetchAndTriage);

// ─────────────────────────────────────
// Demo Mode: Real AI on seed emails
// ─────────────────────────────────────
router.post('/gmail/demo-triage', async (req, res) => {
    const triageService = require('../services/triageService');
    const logger = require('../utils/logger');

    const seedEmails = [
        { subject: 'URGENT: Production server is down — all services offline', from: 'alerts@yourcompany.com', body: 'Critical alert: The production API server has been unreachable for 12 minutes. All user-facing services are down. Immediate attention required. Auto-escalating in 5 minutes.' },
        { subject: 'Re: Q4 Budget sign-off — need by EOD', from: 'sarah.chen@company.com', body: 'Hey, following up on the Q4 budget deck. The CFO needs the final version signed off by 5pm today or the budget cycle gets delayed by two weeks. Can you confirm?' },
        { subject: 'Your Amazon order has shipped', from: 'auto-confirm@amazon.com', body: 'Your order #112-3345667 has been shipped via UPS. Expected delivery: Thursday. Track your package at ups.com.' },
        { subject: 'Team standup notes — April 17', from: 'team-bot@slack.com', body: 'Standup summary: Alex blocked on auth PR review. Priya completed the database migration. Sprint velocity on track for Friday release.' },
        { subject: '50% off sale ends TONIGHT — Shop now!', from: 'deals@retailstores.com', body: 'Don\'t miss out! Our biggest sale of the season ends tonight at midnight. Use code SAVE50 at checkout. Shop 1000+ items on sale now.' },
        { subject: 'Contract renewal — decision needed this week', from: 'legal@bigclient.com', body: 'Hi, our current SLA contract expires April 30. We need confirmation of renewal terms by Friday to avoid service interruption for 2400 users. Please advise on pricing.' },
        { subject: 'Weekly newsletter — Tech roundup', from: 'newsletter@techdigest.com', body: 'This week in tech: OpenAI releases GPT-5, Apple announces AR glasses, Nvidia stock hits new high. Read more at our website.' },
        { subject: 'Interview feedback needed — Candidate: Raj Patel', from: 'hr@company.com', body: 'Hi, the hiring panel is waiting for your interview feedback for Raj Patel (Senior Engineer role). The offer deadline is tomorrow. Please submit your scorecard in Greenhouse.' }
    ];

    try {
        logger.info('Running demo triage on seed emails...');
        const triageData = await triageService.triageBatch(seedEmails);
        
        // Extract successful results
        const finalResults = triageData.results
            .filter(r => r.success)
            .map(r => r.result);

        res.json({ success: true, count: finalResults.length, results: finalResults, demo: true });
    } catch (err) {
        logger.error('Demo triage failed:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

