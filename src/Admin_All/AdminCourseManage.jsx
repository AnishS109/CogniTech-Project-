import React, { useEffect, useState } from 'react';
import AdminLayout from './LAYOUT/AdminLayout';
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Modal, TextField, Stack } from '@mui/material';
import axios from 'axios';

const AdminCourseManage = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmOpenModal,setConfirmOpenModal] = useState(false);
  
  // State for the form data
  const [courseDetails, setCourseDetails] = useState({
    name: '',
    description: '',
    lectures: 0,  
    quiz: 0,
  });

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api-courses/all-course-details');
      const data = await response.json();
      setAllCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();  
    
    try {
      const response = await axios.post('http://localhost:5000/api/admin/add-course', {
        name: courseDetails.name,
        description: courseDetails.description,
        lecture: courseDetails.lectures,
        quiz: courseDetails.quiz,
      });
  
    setConfirmOpenModal(true)
    setOpenModal(false)
      
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async(courseId) => {

    console.log(`Delete course with ID: ${courseId}`);

    try {

      const response = await fetch(`http://localhost:5000/api/admin-d/delete-course/${courseId}`,{method:"DELETE"})

      if (response.ok) {
        setAllCourses(allCourses.filter(course => course.id !== courseId)); // Update UI after deletion
        console.log("Course deleted successfully.");
      }
      

    } catch (error) {
      console.error("Error in deleting Course",error)
    }

  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <AdminLayout>
        <Box sx={{ marginBottom: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="course details table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Course ID</TableCell>
                      <TableCell>Course Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Lectures</TableCell>
                      <TableCell>Quiz</TableCell>
                      <TableCell>Update</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.id}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.description}</TableCell>
                        <TableCell>{course.lecture}</TableCell>
                        <TableCell>{course.quiz}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(course.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <center>
          <Button
            variant="contained"
            sx={{ m: "10px" }}
            onClick={handleOpen}
          >
            Add Course
          </Button>
        </center>

        {/* Modal for Adding Course */}
        <Modal
          open={openModal}
          onClose={handleClose}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
            width: '400px',
            boxShadow: 24,
          }}>
            <Typography variant="h6" mb={2}>
              Add New Course
            </Typography>
            <form method='POST' onSubmit={handleAddCourse}>
              <Stack spacing={2}>
                <TextField
                  label="Course Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={courseDetails.name}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Course Description"
                  variant="outlined"
                  fullWidth
                  name="description"
                  value={courseDetails.description}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Lectures Count"
                  variant="outlined"
                  fullWidth
                  name="lectures"  // Make sure 'lectures' matches the state property
                  type="number"
                  value={courseDetails.lectures}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Quiz Count"
                  variant="outlined"
                  fullWidth
                  name="quiz"
                  type="number"
                  value={courseDetails.quiz}
                  onChange={handleInputChange}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="outlined" onClick={handleClose}>Close</Button>
                  <Button variant="contained" type="submit">Add Course</Button>
                </Box>

              </Stack>
            </form>
          </Box>
        </Modal>

        {confirmOpenModal && (
          <Modal
            open={confirmOpenModal}
            onClose={() => setConfirmOpenModal(false)}
          >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 2,
              width: '300px',
              boxShadow: 24,
              textAlign: 'center',
            }}>
              <Typography variant="h6" mb={2}>
                Course Added Successfully!
              </Typography>
            </Box>
          </Modal>
        )}

      </AdminLayout>
    </>
  );
};

export default AdminCourseManage;
