// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import TeacherLayout from "./LAYOUT/TeacherLayout";
// import { useLocation } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Tabs,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";

// const TeacherDashBoard = () => {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourseIndex, setSelectedCourseIndex] = useState(0); // State for active course tab
//   const location = useLocation();

//   const teacherIdFromLocation = location.state?.teacher_id;
//   const teacherId = teacherIdFromLocation || localStorage.getItem("teacher_id");

//   useEffect(() => {
//     // Fetch courses and students
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5001/api/teacher-dashboard/course-student-fetch/${teacherId}`
//         );
//         setCourses(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       }
//     };

//     fetchCourses();
//   }, [teacherId]);

//   // Handle course tab change
//   const handleCourseChange = (event, newIndex) => {
//     setSelectedCourseIndex(newIndex);
//   };

//   return (
//     <TeacherLayout>
//       <Box sx={{ padding: "20px" }}>
//         <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
//           Teacher Dashboard
//         </Typography>

//         {/* Tabs for courses */}
//         <Tabs
//           value={selectedCourseIndex}
//           onChange={handleCourseChange}
//           variant="scrollable"
//           scrollButtons="auto"
//           sx={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}
//         >
//           {courses.map((course, index) => (
//             <Tab key={index} label={course.courseName} />
//           ))}
//         </Tabs>

//         {/* Enrolled students for the selected course */}
//         {courses.length > 0 ? (
//           <Box>
//             <Typography
//               variant="h5"
//               gutterBottom
//               sx={{ fontWeight: "bold", marginTop: "10px" }}
//             >
//               Enrolled Students
//             </Typography>
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: "bold" }}>S No.</TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {courses[selectedCourseIndex]?.students.length > 0 ? (
//                     courses[selectedCourseIndex].students.map((student, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{student}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={2} align="center">
//                         No students enrolled
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         ) : (
//           <Typography variant="h6" color="textSecondary">
//             No courses found.
//           </Typography>
//         )}
//       </Box>
//     </TeacherLayout>
//   );
// };

// export default TeacherDashBoard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import TeacherLayout from "./LAYOUT/TeacherLayout";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  Button,
  Avatar,
} from "@mui/material";
import { blue, grey, green } from "@mui/material/colors";

const TeacherDashBoard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0); // State for active course tab
  const location = useLocation();

  const teacherIdFromLocation = location.state?.teacher_id;
  const storedTeacherId = localStorage.getItem("teacher_id");
  
  // If teacherIdFromLocation exists, update localStorage
  useEffect(() => {
    if (teacherIdFromLocation) {
      localStorage.setItem("teacher_id", teacherIdFromLocation);
    }
  }, [teacherIdFromLocation]);
  
  // Use teacherId from location or fallback to localStorage
  const teacherId = teacherIdFromLocation || storedTeacherId;


  useEffect(() => {
    // Fetch courses and students
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/teacher-dashboard/course-student-fetch/${teacherId}`
        );
        setCourses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [teacherId]);

  // Handle course tab change
  const handleCourseChange = (event, newIndex) => {
    setSelectedCourseIndex(newIndex);
  };

  const handleDelete = (username_stu) => {
    console.log(username_stu);
  }

  return (
    <TeacherLayout>
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: blue[800] }}>
          Teacher Dashboard
        </Typography>

        {/* Tabs for courses */}
        <Tabs
          value={selectedCourseIndex}
          onChange={handleCourseChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            marginBottom: "20px",
            borderBottom: "2px solid",
            borderColor: blue[300],
            "& .MuiTab-root": { fontWeight: "bold", color: blue[700] },
            "& .Mui-selected": { color: green[600] },
          }}
        >
          {courses.map((course, index) => (
            <Tab key={index} label={course.courseName} />
          ))}
        </Tabs>

        {/* Enrolled students for the selected course */}
        {courses.length > 0 ? (
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", marginTop: "10px", color: blue[700] }}
            >
              Enrolled Students
            </Typography>

            <Card sx={{ backgroundColor: grey[100], padding: "15px", boxShadow: 2 }}>
              <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: blue[800] }}>S No.</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: blue[800] }}>Student Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: blue[800] }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: blue[800] }}>Enrollment Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: blue[800] }}>REMOVE</TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses[selectedCourseIndex]?.students.length > 0 ? (
                      courses[selectedCourseIndex].students.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar sx={{ marginRight: "10px", backgroundColor: blue[500] }}>
                                {student.name.charAt(0)}
                              </Avatar>
                              {student.name}
                            </Box>
                          </TableCell>
                          <TableCell>{student.username}</TableCell>
                          <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                          <TableCell >

                            <Button 
                            variant="contained" 
                            color="error"
                            onClick={() => handleDelete(student.username)}
                            >
                              Delete
                              </Button>
                              </TableCell>

                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ fontStyle: "italic", color: grey[500] }}>
                          No students enrolled
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        ) : (
          <Typography variant="h6" color="textSecondary" sx={{ marginTop: "20px" }}>
            No courses found.
          </Typography>
        )}
      </Box>
    </TeacherLayout>
  );
};

export default TeacherDashBoard;
