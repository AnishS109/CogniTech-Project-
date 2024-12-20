// import React, { useEffect, useState } from 'react';
// import AdminLayout from './LAYOUT/AdminLayout';
// import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// const AdminUserManage = () => {
//   const [students, setStudents] = useState([]);
//   const [open, setOpen] = useState(false); // Modal state
//   const [studentToDelete, setStudentToDelete] = useState(null); // Student to delete

//   const fetchStudents = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/admin-s/admin-student-details');
//       const data = await response.json();
//       setStudents(data);
//     } catch (error) {
//       console.error("Error in fetching:", error);
//     }
//   };

//   const handleDelete = async (studentId) => {
//     setStudentToDelete(studentId); // Set student to delete
//     setOpen(true); // Open confirmation modal
//   };

//   const confirmDelete = async () => {
//     try {
//       const response = await fetch(`http://localhost:5001/api/admin-user-m/user-manage/${studentToDelete}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         // Remove the student from the state list
//         setStudents((prevStudents) => prevStudents.filter((student) => student.student_id !== studentToDelete));
//       } else {
//         console.error("Failed to delete the student");
//       }
//       setOpen(false); // Close the modal after deletion
//     } catch (error) {
//       console.error("Error in deletion:", error);
//       setOpen(false); // Close the modal in case of error
//     }
//   };

//   const cancelDelete = () => {
//     setOpen(false); // Close the modal if cancelled
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   return (
//     <>
//       <AdminLayout>
//         <Box sx={{ marginBottom: 3 }}>
//           <Typography variant="h4" gutterBottom sx={{ml:"15px",mt:"20px"}}>Student Details</Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Box sx={{ overflowX: 'auto' }}>
//                 <Table sx={{ minWidth: 650 }} aria-label="student details table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Student ID</TableCell>
//                       <TableCell>Student Name</TableCell>
//                       <TableCell>Username</TableCell>
//                       <TableCell>Enrolled Courses</TableCell>
//                       <TableCell>UPDATE</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {students.map((student) => (
//                       <TableRow key={student.studentId}>
//                         <TableCell>{student.studentId}</TableCell>
//                         <TableCell>{student.studentName}</TableCell>
//                         <TableCell>{student.studentUsername}</TableCell>
//                         <TableCell>{student.enrolledCourses ? student.enrolledCourses : "No Course Enrolled"}</TableCell>
//                         <TableCell>
//                           <Button
//                             variant="contained"
//                             color="error"
//                             onClick={() => handleDelete(student.studentId)}
//                           >
//                             Delete
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Box>
//             </Grid>
//           </Grid>
//         </Box>

//         {/* Confirmation Dialog */}
//         <Dialog open={open} onClose={cancelDelete}>
//           <DialogTitle>Confirm Deletion</DialogTitle>
//           <DialogContent>
//             <Typography variant="body1">
//               Are you sure you want to delete this student's details and all their enrolled courses?
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={cancelDelete} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={confirmDelete} color="error">
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </AdminLayout>
//     </>
//   );
// };

// export default AdminUserManage;


import React, { useEffect, useState } from 'react';
import AdminLayout from './LAYOUT/AdminLayout';
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material';

const AdminUserManage = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false); // Modal state
  const [studentToDelete, setStudentToDelete] = useState(null); // Student to delete

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin-s/admin-student-details');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error in fetching:", error);
    }
  };

  const handleDelete = async (studentId) => {
    setStudentToDelete(studentId); // Set student to delete
    setOpen(true); // Open confirmation modal
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin-user-m/user-manage/${studentToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the student from the state list
        setStudents((prevStudents) => prevStudents.filter((student) => student.studentId !== studentToDelete));
      } else {
        console.error("Failed to delete the student");
      }
      setOpen(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error in deletion:", error);
      setOpen(false); // Close the modal in case of error
    }
  };

  const cancelDelete = () => {
    setOpen(false); // Close the modal if cancelled
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <AdminLayout>
      <Box sx={{ marginBottom: 3, padding: '20px', backgroundColor: 'background.default' }}>
        <Typography variant="h4" gutterBottom sx={{ marginBottom: '20px' }}>
          Student Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ boxShadow: 3, borderRadius: 2 }}>
              <Box sx={{ padding: '16px', backgroundColor: 'primary.main', borderRadius: '8px 8px 0 0', color: 'white' }}>
                <Typography variant="h6">Manage Students</Typography>
              </Box>
              <Box sx={{ overflowX: 'auto', padding: '16px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="student details table">
                  <TableHead sx={{ backgroundColor: 'grey.100' }}>
                    <TableRow>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Enrolled Courses</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.studentId} sx={{ '&:hover': { backgroundColor: 'grey.50' } }}>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>{student.studentUsername}</TableCell>
                        <TableCell>{student.enrolledCourses || 'No Course Enrolled'}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(student.studentId)}
                            sx={{
                              textTransform: 'none',
                              padding: '6px 16px',
                              '&:hover': { backgroundColor: 'error.dark' }
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={cancelDelete} sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}>
        <DialogTitle sx={{ backgroundColor: 'error.main', color: 'white' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this student's details and all their enrolled courses?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '8px 24px' }}>
          <Button onClick={cancelDelete} color="primary" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" sx={{ textTransform: 'none' }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUserManage;
