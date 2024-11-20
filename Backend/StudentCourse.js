const express = require("express");
const db = require("./utils/database");
const cors = require('cors');

const StudentCourse = express();

StudentCourse.use(cors());
StudentCourse.use(express.json());
StudentCourse.use(express.urlencoded({ extended: true }));

StudentCourse.get("/student-course", async (req, res) => {
  const student_id = req.query.student_id;  

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const query = `
  SELECT ac.id as course_id, ac.name, ac.description, ac.lecture, ac.quiz
  FROM enrolled_course ec
  INNER JOIN allcourses ac ON ec.course_id = ac.id
  INNER JOIN registration_details rd ON rd.id = ec.student_id  -- Adjust as necessary
  WHERE ec.student_id = ?;
  `;

  try {

    const result = await db.execute(query, [student_id]);


    const rows = result[0]; 
    if (!Array.isArray(rows)) {
      return res.status(500).json({ error: 'Unexpected result format' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No courses found for this student' });
    }
    console.log("idhar se chale gya");

    res.status(200).json({
      student_id: student_id,
      enrolled_courses: rows
    })
    
    ;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching student courses' });
  }
});

module.exports = StudentCourse;

