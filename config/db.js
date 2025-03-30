const mysql = require('mysql2');

console.log("ENV CHECK:", process.env.MYSQL_HOST, process.env.MYSQL_PORT, process.env.MYSQL_USER);

const db = mysql.createPool({
  host: process.env.MYSQL_HOST || "mysql.railway.internal",
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Database connected');
  connection.release();
});

module.exports = db;
