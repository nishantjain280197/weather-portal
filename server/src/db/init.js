const Database = require('better-sqlite3');
const path = require('path');

function initializeDatabase() {
  const dbPath = path.join(__dirname, '../../data/weather-portal.db');
  const fs = require('fs');
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      search_date TEXT NOT NULL,
      risk_summary TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS peril_thresholds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      peril_type TEXT NOT NULL UNIQUE,
      low_max REAL,
      moderate_max REAL,
      high_max REAL,
      unit TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      details TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as cnt FROM peril_thresholds').get();
  if (count.cnt === 0) {
    const insert = db.prepare(
      'INSERT INTO peril_thresholds (peril_type, low_max, moderate_max, high_max, unit) VALUES (?, ?, ?, ?, ?)'
    );
    insert.run('wind', 25, 40, 58, 'mph');
    insert.run('hail', 0.5, 1.0, 2.0, 'inches');
    insert.run('precipitation', 0.5, 1.5, 3.0, 'inches');
    insert.run('temperature_high', 95, 105, 115, '°F');
    insert.run('temperature_low', 32, 10, -10, '°F');
  }

  return db;
}

module.exports = { initializeDatabase };
