const express = require("express")
const db = require("./utils/database")
const cors = require('cors');

const allcourseDetails = express();

allcourseDetails.use(cors());
allcourseDetails.use(express.json());
allcourseDetails.use(express.urlencoded({ extended: true }));

allcourseDetails.get("/all-course-details",(req,res) => {
  const query = "SELECT name, description FROM allcourses"

  db.query(query,(err,result)=> {
    if (err) {
      console.error("Error in Fetching Courses:", err.message);
      res.status(500).json({ error: "Error fetching courses", details: err.message });
    } else {
      res.json(result);
    }
  })
})

module.exports = allcourseDetails;