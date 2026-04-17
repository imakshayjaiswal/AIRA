const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'aria.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
});

db.all('SELECT email, context_workday, context_senders, created_at FROM users', [], (err, rows) => {
    if (err) {
        console.error('Error querying database:', err.message);
        return;
    }
    console.log('\n========================================');
    console.log(' ARIA DATABASE VIEW (USERS TABLE)');
    console.log('========================================\n');
    
    if (rows.length === 0) {
        console.log('No users found in database yet.');
    } else {
        console.table(rows);
    }
    
    console.log('\n(Passwords and App Keys are hidden for security)');
    console.log('========================================\n');
});

db.close();
