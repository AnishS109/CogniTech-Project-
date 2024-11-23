const express = require('express');
const db = require('./utils/database'); // assuming you have a db.js to handle DB connection
const cors = require('cors');

const AdminUserManage = express();

AdminUserManage.use(cors());
AdminUserManage.use(express.json());
AdminUserManage.use(express.urlencoded({ extended: true }));

// DELETE route to remove a student by studentId
AdminUserManage.delete("/user-manage/:studentId", (req, res) => {
  const studentId = req.params.studentId;  // Get the studentId from the URL parameter

  // Start the transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Failed to start transaction' });
    }

    // First, delete the student's enrolled courses from the enrolled_course table
    const deleteCoursesQuery = `
      DELETE FROM enrolled_course
      WHERE student_id = ?;
    `;
    db.query(deleteCoursesQuery, [studentId], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error deleting courses:', err);
          return res.status(500).json({ error: 'Failed to delete courses' });
        });
      }

      // Now, delete the student from the registration_details table
      const deleteStudentQuery = `
        DELETE FROM registration_details
        WHERE id = ?;
      `;
      db.query(deleteStudentQuery, [studentId], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error deleting student:', err);
            return res.status(500).json({ error: 'Failed to delete student' });
          });
        }

        // Commit the transaction if both queries are successful
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error committing transaction:', err);
              return res.status(500).json({ error: 'Failed to commit transaction' });
            });
          }

          // Respond back with a success message
          res.status(200).json({ message: 'Student and their enrolled courses deleted successfully' });
        });
      });
    });
  });
});

module.exports = AdminUserManage