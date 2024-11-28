import express from "express";
import connectDB from "./utils/database.js"
import userRegister from "./routes/userRegister.js";
import latestCourse from "./routes/latestCourse.js";
import login from "./routes/login.js";
import allCourses from "./routes/allcourses.js";
import enrolledCourse from "./routes/enrolledCourses.js";
import AddCourse from "./routes/AddCourse.js";
import router from "./routes/FetchCourse.js";
import AdminStudentFetch from "./routes/AdminStudentFetch.js";
import AdminUserManage from "./routes/AdminUserManage.js";
import AdminDeleteCourse from "./routes/AdminDeleteCourse.js";


const app = express()

connectDB()

app.use("/api/user",userRegister)
app.use("/api/latest",latestCourse)
app.use("/api/login",login)
app.use("/api/all",allCourses)
app.use("/api/enrolled",enrolledCourse)
app.use("/api/add-course",AddCourse)
app.use("/api/router",router)
app.use("/api/admin-s",AdminStudentFetch)
app.use("/api/admin-user-m",AdminUserManage)
app.use("/api/admin-d",AdminDeleteCourse)


app.use((req,res,next) => {
  console.log("Backend nahi chal raha bhai")
})

const PORT = 5001
app.listen(PORT , () => {
  console.log(`http://localhost:${PORT}`);
})