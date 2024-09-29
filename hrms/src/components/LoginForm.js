import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; 
import { useNavigate } from 'react-router-dom';  
import './LoginForm.css'; // Import the updated CSS

const LoginForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', formData);  
      if (response.data.access) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        setSuccess(true);
        setError('');
        setTimeout(() => navigate('/companysetup'), 1000);  
      }
    } catch (err) {
      setError('Invalid credentials');
      setSuccess(false);
    }
  };

  return (
    <div>
      <Navbar />  
      <div className="login-container">
        <div className="login-form-container">
          <h2>Welcome back 👋</h2>
          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="userName">Username:</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">Login successful!</p>}

            <button type="submit" className="login-btn">Login</button>
          </form>
          <p className="forgot-password">Forgot password?</p>
          <p>Don't have an account? <a href="/register">Register Now</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
