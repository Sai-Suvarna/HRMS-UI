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
  // new roles
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://localhost:8000/api/login/', formData);  
  //     if (response.data.access) {
  //       localStorage.setItem('access', response.data.access);
  //       localStorage.setItem('refresh', response.data.refresh);
  //       setSuccess(true);
  //       setError('');
  //       setTimeout(() => navigate('/companysetup'), 1000);  
  //     }
  //   } catch (err) {
  //     setError('Invalid credentials');
  //     setSuccess(false);
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //       const response = await axios.post('http://localhost:8000/api/login/', formData);
  //       if (response.data.access) {
  //           localStorage.setItem('access', response.data.access);
  //           localStorage.setItem('refresh', response.data.refresh);
  //           localStorage.setItem('userId', response.data.user_id);  // Store the user ID
  //           setSuccess(true);
  //           setError('');

  //           if (!response.data.is_company_setup_complete) {
  //               navigate('/companysetup');  // Redirect to company setup if not complete
  //           } else if (!response.data.is_payroll_setup_complete) {
  //               navigate('/payrolesetup');  // Redirect to payroll setup if company setup is done but payroll isn't
  //           } else {
  //               navigate('/employeelist');  // If both are done, go to employee list
  //           }
  //       }
  //   } catch (err) {
  //       setError('Invalid credentials');
  //       setSuccess(false);
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://localhost:8000/api/login/', formData);  // API call to login

  //     if (response.data.access) {
  //       localStorage.setItem('access', response.data.access);
  //       localStorage.setItem('refresh', response.data.refresh);
  //       localStorage.setItem('userId', response.data.user_id);  // Store the user ID

  //       // Debugging to ensure values are coming correctly
  //       console.log("Company Setup Complete:", response.data.is_company_setup_complete);
  //       console.log("Payroll Setup Complete:", response.data.is_payroll_setup_complete);

  //       setSuccess(true);
  //       setError('');

  //       // Check redirection based on backend flags
  //       if (!response.data.is_company_setup_complete) {
  //         navigate('/companysetup');  // If company setup is incomplete, redirect to setup
  //       } else if (!response.data.is_payroll_setup_complete) {
  //         navigate('/payrolesetup');  // If payroll setup is incomplete, redirect to payroll setup
  //       } else {
  //         navigate('/Home');  // If both are complete, go to employee list
  //       }
  //     }
  //   } catch (err) {
  //     setError('Invalid credentials');
  //     setSuccess(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8000/api/login/', formData);  // API call to login

        if (response.data.access) {
            // Clear any old session data from previous users
            localStorage.clear();

            // Store new session data for the logged-in user
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            localStorage.setItem('userId', response.data.user_id);  // Store the user ID
            
            // Check if the user has a company ID (existing user)
            if (response.data.company_id) {
                localStorage.setItem('companyId', response.data.company_id);  // Store the company ID for existing users
            }

            setSuccess(true);
            setError('');

            // Redirection logic based on backend flags
            if (!response.data.is_company_setup_complete) {
                navigate('/companysetup');  // If company setup is incomplete, redirect to setup
            } else if (!response.data.is_payroll_setup_complete) {
                // navigate('/payrolesetup');  
                navigate('/payroleset');  

            } else {
                navigate('/Home');  // If both are complete, go to employee list
            }
        }
    } catch (err) {
        setError('Invalid credentials');
        setSuccess(false);
    }
};


  return (
    <div>
      {/* <Navbar />   */}
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
