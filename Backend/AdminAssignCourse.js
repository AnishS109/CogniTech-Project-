const express = require('express')
const db = require('./utils/database')
const cors = require('cors')

const AdminAssignCourse = express()

AdminAssignCourse.use(cors())
AdminAssignCourse.use(express.json())
AdminAssignCourse.use(express.urlencoded({ extended : true }))

AdminAssignCourse.post("/assign-course",(req,res) => {

  const {teacher_id , course_id} = req.body

  console.log(req.body);
  

  const Query = `
              INSERT INTO assign_course (teacher_id,course_id)
              VALUES (?,?)
  `
  const VALUES = [teacher_id,course_id]

  db.query(Query,VALUES,(err,result) => {

    if(err){
      console.error("Error in assign Course",err.message)
    }
    else{
      res.json(result)
    }
  }) 
})

module.exports = AdminAssignCourse