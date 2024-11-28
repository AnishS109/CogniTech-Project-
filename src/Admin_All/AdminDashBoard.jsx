import React, { useEffect, useState } from 'react';
import AdminLayout from './LAYOUT/AdminLayout';
import { Container, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';

const AdminDashBoard = () => {

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin-s/admin-student-details');
      const data = await response.json();
      setStudents(data);
      
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    fetchStudents(); 
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin-s/teacher-details'); 
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTeachers(); 
  }, []);

  return (
    <AdminLayout>
      <Container sx={{ marginTop: 3 }}>
        
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Student Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="student details table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Enrolled Courses</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.studentId}>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>{student.studentUsername}</TableCell>
                        <TableCell>{student.enrolledCourses}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Teacher Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="teacher details table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Teacher ID</TableCell>  
                      <TableCell>Teacher Name</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Course Assigned</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.teacher_id}>
                        <TableCell>{teacher._id}</TableCell>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.username}</TableCell>
                        <TableCell>{teacher.course_name ? teacher.course_name : "No Course Assigned"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashBoard;
