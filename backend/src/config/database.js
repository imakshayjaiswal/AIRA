const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

// Database file will be created in the backend root directory
const dbPath = path.resolve(__dirname, '../../aria.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        logger.error('Could not connect to database', err);
    } else {
        logger.info('Connected to SQLite database at ' + dbPath);
    }
});

function initDB() {
    return new Promise((resolve, reject) => {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                email TEXT PRIMARY KEY,
                password_hash TEXT NOT NULL,
                imap_password TEXT NOT NULL,
                context_workday TEXT,
                context_senders TEXT,
                context_focus TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        db.run(query, (err) => {
            if (err) {
                logger.error('Failed to initialize users table:', err);
                reject(err);
            } else {
                logger.info('Users table initialized successfully.');
                resolve();
            }
        });
    });
}

// Immediately initialize the DB when required
initDB();

module.exports = db;
