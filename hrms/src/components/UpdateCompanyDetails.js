// src/components/UpdateCompanyDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
// import './UpdateCompanyDetails.css'; 
import Navbar from './Navbar'; // Adjust the path as needed


const UpdateCompanyDetails = () => {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Create navigate object for navigation

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');

    if (!companyId) {
      setError('Company ID not found');
      return;
    }

    // Fetch the current company details to populate the form
    axios
      .get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => {
        setCompany(response.data);
      })
      .catch(error => {
        console.error('Error fetching company details:', error);
        setError('Failed to load company details');
      });
  }, []);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const companyId = localStorage.getItem('companyId');

    axios
      .put(`http://localhost:8000/api/companydetails/update/${companyId}/`, company, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Company details updated:', response.data);
        navigate('/companydetails'); // Navigate back to Company Details page
      })
      .catch(error => {
        console.error('Error updating company details:', error);
        setError('Failed to update company details');
      });
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
    <div className="update-company-details-container">
      <h2>Update Company Details</h2>
      {company ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Admin Name:</label>
            <input
              type="text"
              name="adminName"
              value={company.adminName || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Admin Email:</label>
            <input
              type="email"
              name="adminEmail"
              value={company.adminEmail || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Admin Phone Number:</label>
            <input
              type="text"
              name="adminPhoneNum"
              value={company.adminPhoneNum || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Company Name:</label>
            <input
              type="text"
              name="companyName"
              value={company.companyName || ''}
              onChange={handleChange}
              required
            />
          </div>
          {/* Add more fields as necessary */}
          <button type="submit">Update</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
  );
};

export default UpdateCompanyDetails;
