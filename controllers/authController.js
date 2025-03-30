const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query PostgreSQL menggunakan parameterized query ($1 untuk mencegah SQL Injection)
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User tidak ditemukan' });
    }

    const user = rows[0];

    // Verifikasi password dengan bcrypt
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Password salah' });
    }

    // Generate token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};
