const express = require('express')
const db = require('./utils/database')
const cors = require('cors')

const login = express()

login.use(cors())
login.use(express.json())
login.use(express.urlencoded({ extended: true }))

login.post("/login-check", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Wrap the query in a Promise to use async/await
    const queryPromise = (query, params) => {
      return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
          if (err) {
            reject(err); // Reject the promise in case of error
          } else {
            resolve(results); // Resolve the promise with the query results
          }
        });
      });
    };

    // Run the query to check if the user exists
    const results = await queryPromise("SELECT * FROM registration_details WHERE username = ?", [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const user = results[0]; // If user found, use the first row

    if (password === user.password) {
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          type:user.type,
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    console.error('Error in login process:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = login;

