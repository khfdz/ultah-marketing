const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { username, email, password } = req.body;

  db.query(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        return res.status(409).json({ message: "Email sudah terdaftar" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        `INSERT INTO users SET ?`,
        {
          username,
          email,
          password: hashedPassword,
        },
        (err, result) => {
          if (err) return res.status(500).json({ error: err });

          res.status(201).json({ message: "User berhasil didaftarkan" });
        }
      );
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(401).json({ message: "Username tidak ditemukan" });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ message: "Password salah" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      res.json({ message: "Login berhasil", token });
    }
  );
};
