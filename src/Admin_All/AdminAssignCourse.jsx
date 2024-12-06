import React, { useEffect, useState } from 'react';
import AdminLayout from './LAYOUT/AdminLayout';
import {
  Box,
  Button,
  Grid,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
} from '@mui/material';

const AdminAssignCourse = () => {
  const [openModal, setOpenModal] = useState(false);
  const [assignCourse, setAssignCourse] = useState({
    teacher_username: '',
    courseId: '',
  });
  const [teachers, setTeachers] = useState([]); // Ensure teachers is initialized as an array
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAssignCourse = (e) => {
    const { name, value } = e.target;
    setAssignCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setAssignCourse({ teacher_username: '', courseId: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/admin-t/course-assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignCourse),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setSuccessMessage(data.message);
        setError('');
        handleClose();
        fetchTeachers(); // Refresh teacher list
      } else {
        setError(data.message || 'Failed to assign course');
        setSuccessMessage('');
      }
    } catch (error) {
      setError('Error in assigning the course');
      setSuccessMessage('');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin-t/course-details-teacher');
      const data = await response.json();

      // Ensure the data is an array before setting it
      setTeachers(Array.isArray(data) ? data : []);
      console.log(teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]); // Fallback to an empty array
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin-t/all-courses');
      const data = await response.json();

      // Ensure the data is an array before setting it
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchCourses();
  }, []);

  const handleDelete = async (teacherId, courseId) => {
    try {
      const response = await fetch('http://localhost:5001/api/admin-t/course-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId, courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        fetchTeachers(); // Refresh the list
      } else {
        setError(data.message || 'Failed to delete assignment');
      }
    } catch (error) {
      setError('Error in deleting the course');
    }
  };

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
                  label="Enter Teacher Username"
                  name="teacher_username"
                  fullWidth
                  value={assignCourse.teacher_username}
                  onChange={handleAssignCourse}
                />

                <TextField
                  variant="outlined"
                  label="Enter course Id"
                  name="courseId"
                  fullWidth
                  value={assignCourse.courseId}
                  onChange={handleAssignCourse}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.course_name}
                    </option>
                  ))}
                </TextField>

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
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          message={error}
          onClose={() => setError('')}
        />

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
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.length > 0 ? (
                      teachers.map((teacher) => (
                        <TableRow key={teacher.teacher._id}>
                          <TableCell>{teacher.teacher._id}</TableCell>
                          <TableCell>{teacher.teacher.name}</TableCell>
                          <TableCell>{teacher.teacher.username}</TableCell>
                          <TableCell>{teacher.course.course_name}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDelete(teacher.teacher._id, teacher.course._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No Course is Assigned.
                        </TableCell>
                      </TableRow>
                    )}
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
