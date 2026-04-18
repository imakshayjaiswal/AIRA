const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const logger = require('../utils/logger');

class ImapService {
    async fetchRecentMessages(email, password, maxResults = 20) {
        const config = {
            imap: {
                user: email,
                password: password,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                tlsOptions: { rejectUnauthorized: false },
                authTimeout: 15000,
                connTimeout: 15000
            }
        };

        let connection;
        try {
            logger.info(`Connecting to IMAP for: ${email}`);
            connection = await imaps.connect(config);
            await connection.openBox('INBOX');

            // MAXIMUM SPEED STABLE FETCH: We limit strictly to the last 4 days.
            // Downloading full bodies for 60 days takes 5+ minutes on large accounts.
            // 4 days guarantees a near-instant sync (1-3 seconds).
            const fourDaysAgo = new Date();
            fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
            const searchCriteria = [['SINCE', fourDaysAgo]];

            const fetchOptions = {
                bodies: [''],
                markSeen: false
            };
            
            logger.info(`Performing ultra-stable fetch for the last 60 days...`);
            const results = await connection.search(searchCriteria, fetchOptions);
            const sorted = results
                .sort((a, b) => b.attributes.uid - a.attributes.uid)
                .slice(0, maxResults);

            logger.info(`Parsing ${sorted.length} messages (Turbo Sync)...`);

            const parsedMessages = [];

            for (let res of sorted) {
                const all = res.parts.find(p => p.which === '');
                if (all) {
                    try {
                        const parsed = await simpleParser(all.body);
                        parsedMessages.push({
                            id: res.attributes.uid,
                            subject: parsed.subject || '(No Subject)',
                            from: parsed.from?.text || '(Unknown Sender)',
                            date: parsed.date,
                            body: (parsed.text || '').substring(0, 1500) // Truncate for AI
                        });
                    } catch (parseErr) {
                        logger.warn('Failed to parse a message:', parseErr.message);
                    }
                }
            }

            return parsedMessages;

        } catch (error) {
            logger.error('IMAP Error details:', error);

            // Give the user an actionable, specific error message
            const msg = error.message || '';
            if (msg.includes('AUTHENTICATIONFAILED') || msg.includes('auth') || msg.includes('LOGIN') || msg.includes('Invalid credentials')) {
                throw new Error(
                    'Authentication failed. Make sure you are using a Google App Password (NOT your regular Gmail password). If you are signed in, please ensure the App Password you provided during Sign Up was completely correct.'
                );
            }
            if (msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT') || msg.includes('connect')) {
                throw new Error(
                    'Cannot reach Gmail. Ensure IMAP is enabled. Raw Error: ' + msg
                );
            }
            throw new Error(`IMAP Error: ${msg}`);
        } finally {
            if (connection) {
                try { connection.end(); } catch (e) { }
            }
        }
    }
}

module.exports = new ImapService();
