const express = require('express')
const db = require('./utils/database')
const cors = require('cors')

const AdminDeleteCourse = express()

AdminDeleteCourse.use(cors())
AdminDeleteCourse.use(express.json())
AdminDeleteCourse.use(express.urlencoded({ extended:true }))

AdminDeleteCourse.delete("/delete-course/:id",(req,res) => {

  const {id} = req.params

  Query = `
      DELETE FROM allcourses
      WHERE id = ?;
  `

  const VALUES = [id]

  db.query(Query,VALUES,(err,result) => {
    if(err){
      console.error("Error in deleting course",err.message)
    }
    else{
      res.json()
    }
  })

})

module.exports = AdminDeleteCourse