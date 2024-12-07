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
//     // Fetch courses assigned to the teacher
//     const assignedCourses = await AssignTeacherSchema.find({ teacherId }).populate("courseId");

//     if (!assignedCourses.length) {
//       return res.status(404).json({ message: "No courses assigned to this teacher." });
//     }

//     // Fetch each course's student details
//     const courseWithStudent = await Promise.all(
//       assignedCourses.map(async (assignment) => {
//         const course = assignment.courseId;

//         // Find enrollments for this course
//         const enrollments = await Enrollment.find({ course: course._id }).populate("user");

//         // Map through enrollments to get student details and enrollment date
//         const students = enrollments.map((enrollment) => ({
//           name: enrollment.user.name, // Student name
//           username: enrollment.user.username, // Student username
//           enrollmentDate: enrollment.enrollmentDate, // Enrollment da
//         }));

//         return {
//           courseName: course.course_name, // Course name
//           students,
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
import mongoose from "mongoose";

const TeacherDashBoard = express();

TeacherDashBoard.use(cors());
TeacherDashBoard.use(express.json());
TeacherDashBoard.use(express.urlencoded({ extended: true }));

// Fetch courses with enrolled students
TeacherDashBoard.get("/course-student-fetch/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Find the courses assigned to the teacher
    const assignedCourses = await AssignTeacherSchema.find({ teacherId }).populate("courseId");

    if (!assignedCourses.length) {
      return res.status(404).json({ message: "No courses assigned to this teacher." });
    }

    // Fetch students for each assigned course
    const courseWithStudent = await Promise.all(
      assignedCourses.map(async (assignment) => {
        const course = assignment.courseId;

        // Fetch enrollments for the course
        const enrollments = await Enrollment.find({ course: course._id }).populate("user");

        // Create a student object that includes the student ID
        const students = enrollments.map((enrollment) => ({
          _id: enrollment.user._id,  // Add student ID (_id)
          name: enrollment.user.name,
          username: enrollment.user.username,
          enrollmentDate: enrollment.enrollmentDate,
        }));

        // Return course details with the students' info
        return {
          courseId: course._id,  // Include course ID here
          courseName: course.course_name,
          students,
        };
      })
    );

    // Send the course and student data to the frontend
    res.json(courseWithStudent);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
});


// Delete a student from a course

// Delete a student from a course
TeacherDashBoard.delete("/course/:courseId/student/:studentId", async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    // Validate `courseId` and `studentId` as ObjectIds
    const isCourseIdValid = mongoose.Types.ObjectId.isValid(courseId);
    const isStudentIdValid = mongoose.Types.ObjectId.isValid(studentId);

    if (!isCourseIdValid || !isStudentIdValid) {
      return res.status(400).json({ message: "Invalid course ID or student ID." });
    }

    // Find the enrollment and delete it
    const deletedEnrollment = await Enrollment.findOneAndDelete({
      course: courseId,
      user: studentId,
    });

    if (!deletedEnrollment) {
      return res.status(404).json({ message: "Student not found in this course." });
    }

    res.json({ message: "Student removed successfully." });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ message: "Failed to remove student.", error });
  }
});



export default TeacherDashBoard;
