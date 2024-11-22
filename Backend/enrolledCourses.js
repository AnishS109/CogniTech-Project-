const express = require("express");
const db = require("./utils/database");
const cors = require('cors');

const enrolledCourses = express();

enrolledCourses.use(cors());
enrolledCourses.use(express.json());  
enrolledCourses.use(express.urlencoded({ extended: true })); 

enrolledCourses.post("/enrolled-courses", async (req, res) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({ error: "Student ID and Course ID are required." });
  }

  const query = `
    INSERT INTO enrolled_course (student_id, course_id) 
    VALUES (?, ?)
  `;
  const values = [student_id, course_id];

  // try {
  //   const result = await db.execute(query, values);

  //   res.status(200).json({
  //     message: "Course enrollment successful",
  //     enrolled_course: {
  //       student_id,
  //       course_id
  //     }
  //   });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: "An error occurred while enrolling in the course." });
  // }

  db.query(query,values, (err,result) => {
    res.json({
      enrolled_course:{
        student_id,
        course_id
      }
    })
  })
});

module.exports = enrolledCourses;




