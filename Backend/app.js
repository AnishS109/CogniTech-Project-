const express = require("express")
const latestCourseDetails = require("./latestCourseDetails")
const registrationDetails = require("./registrationDetails")
const login = require("./login")
const allcourseDetails = require("./allcourses")

const app = express()

app.use("/api",latestCourseDetails)
app.use("/api-courses",allcourseDetails)
app.use("/api/registration", registrationDetails)
app.use("/api/login",login)

app.use((req,res,next) => {
  console.log("Backend nahi chal raha bhai"); 
})

const PORT = 5000
app.listen(PORT, ()=> {
  console.log(`http://localhost:${PORT}`);
})