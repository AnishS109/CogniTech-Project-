const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',   
  password: 'Anish@9098',   
  database: 'lms', 
})

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1); 
  } else {
    console.log('Connected to the database');
  }
});

module.exports = db;

