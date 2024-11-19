const express = require("express")
const db = require("./utils/database")
const cors = require('cors');

const latestCourseDetails = express();

latestCourseDetails.use(cors());
latestCourseDetails.use(express.json());
latestCourseDetails.use(express.urlencoded({ extended: true })); 


latestCourseDetails.get("/courses-details", (req, res) => {
  const query = "SELECT course_name, description, image_url FROM latestcourses";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error in Fetching Courses:", err.message);
      res.status(500).json({ error: "Error fetching courses", details: err.message });
    } else {
      res.json(result);
    }
  });
});

module.exports = latestCourseDetails;

