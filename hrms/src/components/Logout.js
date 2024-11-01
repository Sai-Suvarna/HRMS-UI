// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all data in localStorage
    localStorage.clear();

    // Redirect to the login page
    navigate('/login'); // Adjust the path if needed
  }, [navigate]);

  return null; // No UI needed, purely functional
};

export default Logout;





