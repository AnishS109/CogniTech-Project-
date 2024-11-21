import React, { useEffect, useState } from 'react';
import AdminLayout from './LAYOUT/AdminLayout';
import { Container, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';

const AdminDashBoard = () => {
  // States to store student and teacher data
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Fetch student data
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin-student/admin-student-details'); // Replace with your API endpoint
      const data = await response.json();
      console.log(data); // Log the fetched data to inspect it
      setStudents(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    fetchStudents(); // Fetch students on component mount
  }, []);

  // Fetch teacher data
  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers'); // Replace with your API endpoint
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };

  useEffect(() => {
    fetchStudents(); // Fetch students on component mount
    fetchTeachers(); // Fetch teachers on component mount
  }, []);

  return (
    <AdminLayout>
      <Container sx={{ marginTop: 3 }}>
        <Typography variant="h4" gutterBottom>ADMIN DASHBOARD</Typography>

        {/* Display Student Details */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Student Details</Typography>
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
                <TableRow key={student.student_id}>
                  <TableCell>{student.student_id}</TableCell>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{student.student_username}</TableCell>
                  <TableCell>{student.enrolled_courses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Display Teacher Details */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Teacher Details</Typography>
          <Table sx={{ minWidth: 650 }} aria-label="teacher details table">
            <TableHead>
              <TableRow>
                <TableCell>Teacher ID</TableCell>  {/* New column for Teacher ID */}
                <TableCell>Teacher Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Course Assigned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.id}</TableCell> {/* Display Teacher ID */}
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.username}</TableCell>
                  <TableCell>{teacher.course_assigned}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashBoard;
