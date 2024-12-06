// import express from "express";
// import cors from "cors";
// import AllCourseSchema from "../modals/allCoursesSchema.js";
// import Enrollment from "../modals/enrollmentSchema.js";
// import UserRegisterSchema from "../modals/userRegisterSchema.js";
// import AssignTeacherSchema from "../modals/assignTeacherSchema.js";

// const TeacherDashBoard = express();

// TeacherDashBoard.use(cors());
// TeacherDashBoard.use(express.json());
// TeacherDashBoard.use(express.urlencoded({ extended: true }));

// TeacherDashBoard.get("/course-student-fetch/:teacherId", async (req, res) => {
//   const { teacherId } = req.params; 

//   try {
//     const assignedCourses = await AssignTeacherSchema.find({ teacherId }).populate("courseId");

//     if (!assignedCourses.length) {
//       return res.status(404).json({ message: "No courses assigned to this teacher." });
//     }

//     const courseWithStudent = await Promise.all(
//       assignedCourses.map(async (assignment) => {
//         const course = assignment.courseId;

//         const enrollments = await Enrollment.find({ course: course._id });

//         const studentIds = enrollments.map((enrollment) => enrollment.user);

//         const students = await UserRegisterSchema.find({ _id: { $in: studentIds } });

//         return {
//           courseName: course.course_name,
//           students: students.map((student) => student.name),
//         };
//       })
//     );

//     // Send response to the frontend
//     res.json(courseWithStudent);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).send("Server error");
//   }
// });

// export default TeacherDashBoard;


import express from "express";
import cors from "cors";
import AllCourseSchema from "../modals/allCoursesSchema.js";
import Enrollment from "../modals/enrollmentSchema.js";
import UserRegisterSchema from "../modals/userRegisterSchema.js";
import AssignTeacherSchema from "../modals/assignTeacherSchema.js";

const TeacherDashBoard = express();

TeacherDashBoard.use(cors());
TeacherDashBoard.use(express.json());
TeacherDashBoard.use(express.urlencoded({ extended: true }));

TeacherDashBoard.get("/course-student-fetch/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Fetch courses assigned to the teacher
    const assignedCourses = await AssignTeacherSchema.find({ teacherId }).populate("courseId");

    if (!assignedCourses.length) {
      return res.status(404).json({ message: "No courses assigned to this teacher." });
    }

    // Fetch each course's student details
    const courseWithStudent = await Promise.all(
      assignedCourses.map(async (assignment) => {
        const course = assignment.courseId;

        // Find enrollments for this course
        const enrollments = await Enrollment.find({ course: course._id }).populate("user");

        // Map through enrollments to get student details and enrollment date
        const students = enrollments.map((enrollment) => ({
          name: enrollment.user.name, // Student name
          username: enrollment.user.username, // Student username
          enrollmentDate: enrollment.enrollmentDate, // Enrollment da
        }));

        return {
          courseName: course.course_name, // Course name
          students,
        };
      })
    );

    // Send response to the frontend
    res.json(courseWithStudent);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
});

export default TeacherDashBoard;
