const express = require('express')
const db = require('./utils/database')
const cors = require('cors')

const AdminTeacherDetails = express()

AdminTeacherDetails.use(cors())
AdminTeacherDetails.use(express.json())
AdminTeacherDetails.use(express.urlencoded({ extended : true }))

AdminTeacherDetails.get("/teacher-course", (req, res) => {
  const Query = `
    SELECT 
      rd.id AS teacher_id, 
      rd.name AS teacher_name, 
      rd.username AS teacher_username, 
      ac.course_id, 
      c.name AS course_name
    FROM 
      registration_details rd
      JOIN assign_course ac ON rd.id = ac.teacher_id
      JOIN allcourses c ON ac.course_id = c.id;
  `;

  db.query(Query, (err, result) => {
    if (err) {
      console.error("Error in fetching teacher details ::::", err);
      return res.status(500).json({ message: "Error fetching teacher details" });
    }
    res.json(result);
  });
});


module.exports = AdminTeacherDetails