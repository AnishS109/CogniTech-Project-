import React, { useEffect, useState } from 'react';
import AdminLayout from './LAYOUT/AdminLayout';
import { Box, Button, Grid, Modal, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Snackbar } from '@mui/material';

const AdminAssignCourse = () => {
  const [openModal, setOpenModal] = useState(false);
  const [assignCourse, setAssignCourse] = useState({
    teacherId: '',
    courseId: '',
  });
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle course assignment form changes
  const handleAssignCourse = (e) => {
    const { name, value } = e.target;
    setAssignCourse((prevstate) => ({
      ...prevstate,
      [name]: value,
    }));
  };

  // Open modal to assign course
  const handleOpen = () => {
    setOpenModal(true);
  };

  // Close modal
  const handleClose = () => {
    setOpenModal(false);
    // Reset form when modal is closed
    setAssignCourse({ teacherId: '', courseId: '' });
  };

  // Function to handle course assignment form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/admin-a/assign-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: assignCourse.teacherId,
          course_id: assignCourse.courseId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Course assigned successfully!');
        setError('');
        // Optionally, you can fetch the updated list of teachers here if needed
        // setTeachers(data); // You might fetch teachers from another API endpoint if necessary
      } else {
        setError('Failed to assign course');
        setSuccessMessage('');
      }
    } catch (error) {
      setError('Error in assigning the course');
      setSuccessMessage('');
    }
  };

  // Fetch the list of teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin-t/teacher-course'); // Adjust this endpoint as needed
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []); // Only run on mount

  return (
    <>
      <AdminLayout>
        <center>
          <Button variant="contained" sx={{ m: '20px' }} onClick={handleOpen}>
            Assign Course
          </Button>
        </center>

        {/* Course Assignment Modal */}
        <Modal open={openModal} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 2,
              width: '400px',
              boxShadow: 23,
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <center>
                  <Typography variant="h4">Enter The Details</Typography>
                </center>

                <TextField
                  variant="outlined"
                  label="Enter Teacher Id"
                  name="teacherId"
                  fullWidth
                  value={assignCourse.teacherId}
                  onChange={handleAssignCourse}
                />

                <TextField
                  variant="outlined"
                  label="Enter Course Id"
                  name="courseId"
                  fullWidth
                  value={assignCourse.courseId}
                  onChange={handleAssignCourse}
                />

                <center>
                  <Button type="submit" variant="outlined" sx={{ width: '100px' }}>
                    DONE
                  </Button>
                </center>
              </Stack>
            </form>
          </Box>
        </Modal>

        {/* Display success or error messages */}
        {successMessage && (
          <Snackbar
            open={!!successMessage}
            autoHideDuration={6000}
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        )}

        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Teacher Details Table */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Teacher Details
          </Typography>
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
                        <TableCell>{teacher.teacher_id}</TableCell>
                        <TableCell>{teacher.teacher_name}</TableCell>
                        <TableCell>{teacher.teacher_username}</TableCell>
                        <TableCell>{teacher.course_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AdminLayout>
    </>
  );
};

export default AdminAssignCourse;
