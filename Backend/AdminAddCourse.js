const express = require('express')
const db = require('./utils/database')
const cors = require('cors')

const AdminAddCourse = express ()

AdminAddCourse.use(cors())
AdminAddCourse.use(express.json());
AdminAddCourse.use(express.urlencoded({ extended:true }))

AdminAddCourse.post("/add-course",(req,res) => {

  const {name,description,lecture,quiz} = req.body

  const VALUES = [name,description,lecture,quiz]

  const query = `
            INSERT INTO allcourses (name, description, lecture, quiz)
            VALUES (?,?,?,?);
  `
  
  db.query(query,VALUES,(err,result) => {
    if(err){
      console.error("Error in Adding Course",err.message)
    } 
    else{
      res.json(result)
    } 
  })

})

module.exports = AdminAddCourse

