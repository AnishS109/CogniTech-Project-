import React, { useState, useEffect } from 'react';
import TeacherLayout from './LAYOUT/TeacherLayout';
import { AppBar, Toolbar, Tabs, Tab, Box, Paper, TextField, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { blue, green } from '@mui/material/colors';

const TeacherCourses = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const location = useLocation();
  const [addvideo,setAddVideo] = useState({
    lectureName:"",
    lectureURL:""
  })
  
  const teacherIdFromLocation = location.state?.teacher_id;
  const storedTeacherId = localStorage.getItem("teacher_id");

  useEffect(() => {
    if (teacherIdFromLocation) {
      localStorage.setItem("teacher_id", teacherIdFromLocation);
    }
  }, [teacherIdFromLocation]);

  const teacherId = teacherIdFromLocation || storedTeacherId;

  const handleAddVideo = (e) => {
    const {name,value} = e.target
    setAddVideo((prev) => ({
      ...prev,
      [name]:value,
    }))
  }

  const handleSubmitVideo = () => {
    console.log(addvideo);
    setAddVideo({
      lectureName:"",
      lectureURL:""
    })
  }


  useEffect(() => {
    const fetchAssignedCourses = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/teacher-dashboard/course-student-fetch/${teacherId}`);
        const result = await response.json();

        if (Array.isArray(result)) {
          setAssignedCourses(result);
        } else {
          console.error("Expected an array of courses, but got:", result);
        }
      } catch (error) {
        console.error("Error fetching assigned courses:", error);
      }
    };

    fetchAssignedCourses();
  }, [teacherId]);

  const handleCourseChange = (event, newValue) => {
    setSelectedCourseIndex(newValue);
  };

  return (
    <TeacherLayout>

      <Box sx={{ padding: "10px", backgroundColor: 'default', minHeight: "100vh" }}>

        <Paper  sx={{ marginBottom: "20px", padding: "10px", borderRadius: "8px" }}>
          <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 0 }}>
            <Toolbar>
              <Tabs
                value={selectedCourseIndex}
                onChange={handleCourseChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  marginBottom: "20px",
                  borderBottom: `2px solid ${blue[300]}`, 
                  flexGrow: 1,
                  "& .MuiTab-root": {
                    fontWeight: "normal", 
                    color: blue[700],
                    textTransform: "none",
                    padding: "10px 20px",
                    transition: "all 0.3s ease"
                  },
                  "& .MuiTab-root": { fontWeight: "bold", color: blue[700] },
                  "& .Mui-selected": {
                    color: green[600],
                  },
                }}
              >
                {assignedCourses.map((course, index) => (
                  <Tab key={index} label={course.courseName} />
                ))}
              </Tabs>
            </Toolbar>
          </AppBar>
        </Paper>

        <Box sx={{ marginTop: "20px", padding: "20px", backgroundColor: 'white', borderRadius: "8px" }}>

          <TextField 
          name="lectureName"
          value={addvideo.lectureName} 
          onChange={handleAddVideo} 
          label={"Lecure name"}/>

          <TextField 
          name='lectureURL' 
          value={addvideo.lectureURL} 
          onChange={handleAddVideo} 
          label={"Lecure URL"}/>

          <Button 
          variant='contained' 
          onClick={handleSubmitVideo}
          > 

          Submit

          </Button>

        </Box>
      </Box>
    </TeacherLayout>
  );
};

export default TeacherCourses;