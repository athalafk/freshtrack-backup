require('dotenv').config();
const { Pool } = require('pg');

console.log("ENV CHECK:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Untuk koneksi ke Supabase
  }
});

pool.connect()
  .then(() => console.log('Database connected to Supabase'))
  .catch(err => console.error('Database connection error:', err));

module.exports = pool;
