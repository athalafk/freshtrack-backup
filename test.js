const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://postgres:hXx1sItPpNvnZeC9@db.baijymorfvnqfdrlmggz.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false } // Supabase membutuhkan SSL
});

pool.connect()
  .then(() => console.log('✅ Connected to Supabase!'))
  .catch(err => console.error('❌ Database connection error:', err))
  .finally(() => pool.end());
