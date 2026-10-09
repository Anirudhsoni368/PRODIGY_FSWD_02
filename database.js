const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "employees.db");

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("❌ Database connection failed:", error.message);
    } else {
        console.log("✅ Connected to SQLite database");
    }
});

db.serialize(() => {

    // Admin users table
    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `, (error) => {
        if (error) {
            console.error("❌ Admin table error:", error.message);
        } else {
            console.log("✅ Admins table ready");
        }
    });

    // Employees table
    db.run(`
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            department TEXT NOT NULL,
            position TEXT NOT NULL,
            salary REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (error) => {
        if (error) {
            console.error("❌ Employee table error:", error.message);
        } else {
            console.log("✅ Employees table ready");
        }
    });
});

module.exports = db;