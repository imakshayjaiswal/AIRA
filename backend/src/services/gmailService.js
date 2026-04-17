const { google } = require('googleapis');
const logger = require('../utils/logger');

class GmailService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
        );
    }

    getAuthUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/userinfo.email'
        ];
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });
    }

    async getTokens(code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        return tokens;
    }

    async fetchMessages(tokens, maxResults = 25) {
        this.oauth2Client.setCredentials(tokens);
        const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: maxResults,
            q: 'category:primary' // Focus on primary inbox
        });

        const messages = res.data.messages || [];
        const fullMessages = await Promise.all(
            messages.map(async (msg) => {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id,
                    format: 'full'
                });
                return this.parseMessage(detail.data);
            })
        );

        return fullMessages;
    }

    parseMessage(msg) {
        const headers = msg.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
        const from = headers.find(h => h.name === 'From')?.value || '(Unknown Sender)';
        const date = headers.find(h => h.name === 'Date')?.value;

        let body = '';
        if (msg.payload.parts) {
            const textPart = msg.payload.parts.find(p => p.mimeType === 'text/plain');
            if (textPart && textPart.body.data) {
                body = Buffer.from(textPart.body.data, 'base64').toString();
            }
        } else if (msg.payload.body.data) {
            body = Buffer.from(msg.payload.body.data, 'base64').toString();
        }

        return {
            id: msg.id,
            threadId: msg.threadId,
            subject,
            from,
            date,
            snippet: msg.snippet,
            body: body.substring(0, 2000) // Truncate for AI processing
        };
    }
}

module.exports = new GmailService();
