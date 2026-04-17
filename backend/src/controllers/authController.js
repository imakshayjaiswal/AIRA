const bcrypt = require('bcryptjs');
const db = require('../config/database');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
    const { email, password, imapPassword, workday, senders, focus } = req.body;

    if (!email || !password || !imapPassword) {
        return res.status(400).json({ error: 'Email, Master Password, and App Password are required.' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO users (email, password_hash, imap_password, context_workday, context_senders, context_focus)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.run(query, [email, hash, imapPassword, workday, senders, focus], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'User already exists. Please log in.' });
                }
                logger.error('Database insertion error:', err);
                return res.status(500).json({ error: 'Failed to create account.' });
            }
            
            // Return safe user context (no passwords)
            res.status(201).json({
                success: true,
                user: {
                    email,
                    context: { workday, senders, focus }
                }
            });
        });
    } catch (err) {
        logger.error('Registration error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and Password are required.' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            logger.error('Database selection error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        res.json({
            success: true,
            user: {
                email: user.email,
                context: {
                    workday: user.context_workday,
                    senders: user.context_senders,
                    focus: user.context_focus
                }
            }
        });
    });
};
