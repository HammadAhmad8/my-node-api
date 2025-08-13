// db.js
require('dotenv').config();
const { Pool } = require('pg');

// Use DATABASE_URL if available (deployment-friendly), otherwise use separate fields
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // ssl: { rejectUnauthorized: false } // Uncomment for SSL-required DBs
    })
  : new Pool({
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'notes_app',
      password: process.env.PGPASSWORD || 'Qazi.123',
      port: Number(process.env.PGPORT) || 5432,
    });

module.exports = pool;
