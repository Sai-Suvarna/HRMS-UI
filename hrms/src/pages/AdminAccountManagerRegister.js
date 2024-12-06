import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';


const AdminAccountManagerRegister = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNum: '',
    role: '', 
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/api/register/admin/', formData);
      if (response.status === 201) {
        setSuccess(true);
        setError('');
        navigate('/Home');
      }
    } catch (err) {
      setError('Error registering the user.');
    }
  };

  return (
    <div>
      <Navbar />
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Admin/Account Manager Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNum"
          value={formData.phoneNum}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">Registration successful!</Typography>}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
    </div>
  );
};

export default AdminAccountManagerRegister;
