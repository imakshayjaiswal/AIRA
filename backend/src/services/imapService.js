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

            const fetchOptions = { bodies: [''], markSeen: false };
            const results = await connection.search(['ALL'], fetchOptions);
            const sorted = results
                .sort((a, b) => b.attributes.uid - a.attributes.uid)
                .slice(0, maxResults);

            logger.info(`Parsing ${sorted.length} messages...`);
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
                            body: (parsed.text || '').substring(0, 2000)
                        });
                    } catch (parseErr) {
                        logger.warn('Failed to parse a message, skipping:', parseErr.message);
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
                    'Cannot reach Gmail. Make sure IMAP is enabled: Gmail → Settings → See all settings → Forwarding and POP/IMAP → Enable IMAP.'
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
