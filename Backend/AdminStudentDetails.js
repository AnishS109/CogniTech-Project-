const express = require("express");
const db = require("./utils/database");
const cors = require('cors');

const AdminStudentDetails = express();

AdminStudentDetails.use(cors());
AdminStudentDetails.use(express.json());
AdminStudentDetails.use(express.urlencoded({ extended:true }));


AdminStudentDetails.get("/admin-student-details", async (req, res) => {
  const query = `
SELECT 
  rd.id AS student_id,
  rd.name AS student_name,
  rd.username AS student_username,
  GROUP_CONCAT(ac.name ORDER BY ac.name) AS enrolled_courses
FROM 
  registration_details rd
LEFT JOIN 
  enrolled_course ec ON rd.id = ec.student_id
LEFT JOIN 
  allcourses ac ON ac.id = ec.course_id
WHERE 
  rd.type = 'student'  
GROUP BY 
  rd.id, rd.name, rd.username;
  `;

  db.query(query, (err, result) => {   
    if (err) {
      console.error("Error in Fetching Courses:", err.message);
      res.status(500).json({ error: "Error fetching courses", details: err.message });
    } else {
      res.json(result);
    }
  });
});



module.exports = AdminStudentDetails;
