import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const TeacherRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    username: '',
    password: '',
    subject: '',
    experience: '',
    type: 'teacher', 
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccessMessage(''); 

    const { name, email, phone_number, username, password, subject, experience, type } = formData;

    if (!name || !email || !phone_number || !username || !password) {
      setError('All required fields must be filled.');
      return;
    }

    const sanitizedFormData = {
      ...formData,
      subject: subject || null,
      experience: experience || null,
    };

    try {
      const response = await fetch('http://localhost:5000/api/registration/registration-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedFormData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message || 'Registration successful');
        console.log('Form submitted successfully', result);
        
        
        navigate("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred while submitting the form.');
      }
    } catch (error) {
      console.error('Error in submitting the form:', error);
      setError('An error occurred while submitting the form.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        px: 2,
        bgcolor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          padding: { xs: 2, sm: 3 },
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            color: '#333',
            marginBottom: '24px',
          }}
        >
          FACULTY REGISTRATION
        </Typography>

        {error && (
          <Typography
            color="error"
            variant="body2"
            align="center"
            sx={{
              marginBottom: '16px',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            {error}
          </Typography>
        )}

        {successMessage && (
          <Typography
            color="success"
            variant="body2"
            align="center"
            sx={{
              marginBottom: '16px',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            {successMessage}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Subject Specialization"
            variant="outlined"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Years of Experience"
            variant="outlined"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: '8px',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default TeacherRegistration;