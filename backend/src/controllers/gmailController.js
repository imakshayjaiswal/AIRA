const imapService = require('../services/imapService');
const triageService = require('../services/triageService');
const aiProvider = require('../services/aiProvider');
const logger = require('../utils/logger');
const db = require('../config/database');

exports.fetchAndTriage = async (req, res) => {
    const { email, password: directPassword } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    const doFetch = async (imapPassword, userContext = null) => {
        logger.info(`Fetching emails via IMAP for ${email}...`);
        const messages = await imapService.fetchRecentMessages(email, imapPassword, 10); // Strictly 10 as requested

        if (messages.length === 0) {
            return res.json({ success: true, count: 0, results: [], summary: 'No recent emails found.' });
        }

        // PRE-PROCESSING: Combine similar automated alerts (e.g., Google Security Alerts)
        const groupedMessages = [];
        const seenAlerts = {};

        messages.forEach(m => {
            const lowSubj = m.subject.toLowerCase();
            if (lowSubj.includes('security alert') || lowSubj.includes('new sign-in') || lowSubj.includes('critical security')) {
                const key = 'security_group';
                if (!seenAlerts[key]) {
                    seenAlerts[key] = { ...m, _count: 1 };
                    groupedMessages.push(seenAlerts[key]);
                } else {
                    seenAlerts[key]._count += 1;
                    seenAlerts[key].body += '\n\n--- NEXT ALERT ---\n\n' + m.body;
                }
            } else {
                groupedMessages.push(m);
            }
        });

        groupedMessages.forEach(m => {
            if (m._count > 1) {
                m.subject = `[${m._count} Combined Alerts] Various Security Notifications`;
            }
        });

        logger.info(`Triaging ${groupedMessages.length} grouped messages with AI...`);
        const triageData = await triageService.triageBatch(
            groupedMessages.map(m => ({ subject: m.subject, from: m.from, body: m.body, date: m.date })),
            { userContext }
        );

        // Extract just the successful triage results for the frontend
        const finalResults = triageData.results
            .filter(r => r.success)
            .map(r => r.result);

        // Generate 5-line summary of the fetched emails
        logger.info('Generating 5-line AI summary...');
        const payloadString = finalResults.map(r => `Priority: ${r.priority_score}, Subj: ${r.key_info}`).join('\n');
        const summaryPrompt = "Read this list of email subjects and priority scores. Write a highly concise, exactly 5-line summary of what the user needs to know. Do not output JSON. Just write 5 plain text bullet points.";
        let aiSummary = "";
        try {
            aiSummary = await aiProvider.complete(summaryPrompt, payloadString, 1);
        } catch (err) {
            aiSummary = "Summary could not be generated.";
            logger.warn('Failed to generate summary', err.message);
        }

        res.json({ success: true, count: finalResults.length, results: finalResults, summary: aiSummary });

    };

    try {
        // If a password was sent directly in the request, use it immediately.
        if (directPassword) {
            return await doFetch(directPassword);
        }

        // Otherwise, look it up from the database.
        db.get(
            'SELECT imap_password, context_workday, context_senders, context_focus FROM users WHERE email = ?', 
            [email], 
            async (err, user) => {
                if (err) return res.status(500).json({ error: 'Database error.' });
                if (!user) return res.status(404).json({ 
                    error: 'No account found for this email. Please provide your App Password directly, or sign up first.' 
                });
                
                try {
                    const userContext = {
                        workday: user.context_workday,
                        vip_senders: user.context_senders,
                        focus_goal: user.context_focus
                    };
                    await doFetch(user.imap_password, userContext);
                } catch (fetchErr) {
                    logger.error('IMAP fetch failed:', fetchErr);
                    res.status(500).json({ error: fetchErr.message });
                }
            }
        );

    } catch (error) {
        logger.error('Fetch and Triage failed:', error);
        res.status(500).json({ error: error.message });
    }
};
