const mysql = require('mysql');

// Set up the MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bart'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Simple SQL query to fetch all users
const sql = `
        SELECT Bank.BankName, Branch.BranchLocation 
        FROM Bank 
        JOIN Branch ON Bank.ID = Branch.BankID
    `;

db.query(sql, (err, results) => {
    if (err) {
        console.error('Error executing query:', err.stack);
        return;
    }
    console.log('Results:', results);
});

// Close the database connection
db.end();
