const imapService = require('../services/imapService');
const triageService = require('../services/triageService');
const logger = require('../utils/logger');
const db = require('../config/database');

exports.fetchAndTriage = async (req, res) => {
    const { email, password: directPassword } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    const doFetch = async (imapPassword) => {
        logger.info(`Fetching emails via IMAP for ${email}...`);
        const messages = await imapService.fetchRecentMessages(email, imapPassword, 8);

        if (messages.length === 0) {
            return res.json({ success: true, count: 0, results: [] });
        }

        logger.info(`Triaging ${messages.length} messages with AI...`);
        const triageData = await triageService.triageBatch(
            messages.map(m => ({ subject: m.subject, from: m.from, body: m.body }))
        );

        // Extract just the successful triage results for the frontend
        const finalResults = triageData.results
            .filter(r => r.success)
            .map(r => r.result);

        res.json({ success: true, count: finalResults.length, results: finalResults });

    };

    try {
        // If a password was sent directly in the request, use it immediately.
        if (directPassword) {
            return await doFetch(directPassword);
        }

        // Otherwise, look it up from the database.
        db.get('SELECT imap_password FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error.' });
            if (!user) return res.status(404).json({ 
                error: 'No account found for this email. Please provide your App Password directly, or sign up first.' 
            });
            try {
                await doFetch(user.imap_password);
            } catch (fetchErr) {
                logger.error('IMAP fetch failed:', fetchErr);
                res.status(500).json({ error: fetchErr.message });
            }
        });

    } catch (error) {
        logger.error('Fetch and Triage failed:', error);
        res.status(500).json({ error: error.message });
    }
};
