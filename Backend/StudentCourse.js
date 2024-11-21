const express = require("express");
const db = require("./utils/database");
const cors = require('cors');

const StudentCourse = express();

StudentCourse.use(cors());
StudentCourse.use(express.json());
StudentCourse.use(express.urlencoded({ extended: true }));

StudentCourse.get("/student-course", (req, res) => {
  const student_id = req.query.student_id;

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const query = `
    SELECT ac.id as course_id, ac.name, ac.description, ac.lecture, ac.quiz
    FROM enrolled_course ec
    INNER JOIN allcourses ac ON ec.course_id = ac.id
    INNER JOIN registration_details rd ON rd.id = ec.student_id  
    WHERE ec.student_id = ?;
  `;

  const VALUES = [student_id];

  db.query(query, VALUES, (err, result) => {
    
    const enrolled_courses = result

    res.json({
      student_id: student_id,
      enrolled_courses: enrolled_courses
    });
  });
});

module.exports = StudentCourse;
