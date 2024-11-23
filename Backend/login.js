const express = require('express');
const db = require('./utils/database'); // Assuming this uses mysql.createPool()
const cors = require('cors');

const login = express();

login.use(cors());
login.use(express.json());
login.use(express.urlencoded({ extended: true }));

login.post("/login-check", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const query = "SELECT * FROM registration_details WHERE username = ?";

  // Execute the query to check if the user exists
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error in login process:", err.message);
      return res.status(500).json({ message: 'Internal server error.', details: err.message });
    }

    if (results.length === 0) {
      // No user found with the given username
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const user = results[0]; // If user found, use the first row

    // Check if the password matches
    if (password === user.password) {
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          type: user.type,
        },
      });
    } else {
      // Password does not match
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
  });
});

module.exports = login;