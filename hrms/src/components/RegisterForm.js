import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css'; // Updated CSS

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '', 
    phoneNum: '',
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });


  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });   
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Check password criteria as user types
    if (name === 'password') {
      setPasswordCriteria({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[@$!%*?&]/.test(value),
      });
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setSuccess(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register/', formData); // Update URL
      if (response.status === 201) {
        setSuccess(true);
        setError('');
        setTimeout(() => navigate('/login'), 1000); // Redirect to login page
      }
    } catch (err) {
      setError('Error registering the user');
      setSuccess(false);
    }
  };

  return (
    <div>
      {/* <Navbar />   */}
      <div className="register-container">
        <div className="register-form-container">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
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

            <div className="register-form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-form-group">
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

            {/* Password Criteria Display */}
            <ul className="password-criteria">
              <li className={passwordCriteria.length ? 'met' : ''}>
                At least 8 characters
              </li>
              <li className={passwordCriteria.uppercase ? 'met' : ''}>
                At least 1 uppercase letter
              </li>
              <li className={passwordCriteria.number ? 'met' : ''}>
                At least 1 number
              </li>
              <li className={passwordCriteria.specialChar ? 'met' : ''}>
                At least 1 special character (@$!%*?&)
              </li>
            </ul>

            <div className="register-form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="phoneNum">Phone Number:</label>
              <input
                type="text"
                id="phoneNum"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">Registration successful!</p>}

            <button type="submit" className="register-btn">Register</button>
          </form>
          <p className="login-link">Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
