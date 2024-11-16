import React, { useState } from 'react';
import Navbar from '../pages/Navbar'; 
import '../styles/CompanySetup.css'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import api from "../api";

const steps = ['Admin Info', 'Company Info', 'Organizational Rules'];

const CompanySetup = () => {
  const [formValues, setFormValues] = useState({
    adminName: '',
    adminEmail: '',
    adminPhoneNum: '',
    companyName: '',
    companyRegisteredId: '',
    logo: null,  
    leavePolicy: null,
    pfPolicy: null,
    labourLawLicence: null,
    pan: '',
    tan: '',
    gst: '',
    address: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    let error = '';

    // Validate file types for each specific field
    if (name === 'coi' || name === 'logo') {
      if (!file || !['image/jpeg', 'image/png'].includes(file.type)) {
        error = 'Only .jpg, .jpeg, .png files are allowed for images.';
      }
    } else if (name === 'leavePolicy' || name === 'pfPolicy' || name === 'labourLawLicence') {
      if (!file || !['application/pdf', 'application/msword'].includes(file.type)) {
        error = 'Only .pdf, .doc files are allowed.';
      }
    }

    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    setFormValues(prevValues => ({ ...prevValues, [name]: file }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'adminName':
        if (!/^[A-Za-z\s]+$/.test(value)) error = 'Admin name should only contain alphabets.';
        break;
      case 'adminEmail':
        if (!/^\S+@\S+\.\S+$/.test(value)) error = 'Please enter a valid email address.';
        break;
      case 'adminPhoneNum':
        if (!/^\d{10}$/.test(value)) error = 'Phone number should be 10 digits.';
        break;
      case 'companyName':
      case 'companyRegisteredId':
        if (!/^[A-Za-z0-9\s]+$/.test(value)) error = 'This field should be alphanumeric.';
        break;
      case 'pan':
      case 'tan':
      case 'gst':
        if (!/^[A-Za-z0-9]{10}$/.test(value)) error = 'This field should be alphanumeric and 10 characters long.';
        break;
        case 'address':
          if (!/^[\w\s,./-]+$/.test(value)) {
            error = 'Address contains invalid characters.';
          }
          break;
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

     // Append form values to formData
    Object.entries(formValues).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    // Retrieve the user_id from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('No user ID found in localStorage');
        return;
    }
    formData.append('user_id', userId);  // Add user_id to form data
    
    const url = '/api/companydetails/'; // Endpoint path

    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      console.log('Company details submitted:', response.data);

        if (response.status === 201) {
            setMessage('Successfully submitted');
            const companyId = response.data.companyId;

            if (companyId) {
                // Save the companyId to localStorage and log it for debugging
                localStorage.setItem('companyId', companyId);
                console.log("Company Id:", companyId);

                // Call function to update completion status
                await updateCompletionStatus(companyId);
                navigate('/companydetails'); // Redirect to CompanyDetails page

                // navigate('/payrolesetup');
            } else {
                console.error('Company Id is undefined in the response');
            }
        }
    } catch (error) {
        console.error('Error submitting form:', error.response.data);
    }
  };
  
  const updateCompletionStatus = async () => {
    const userId = localStorage.getItem('userId');  // Retrieve the user ID
    const companyId = localStorage.getItem('companyId');  // Ensure companyId is retrieved
    const url1 = `/api/company-status/${userId}/`;
    try {
      await api.patch(url1, {
        company_id: companyId,  
        is_company_setup_complete: true,
        role: "admin",
        is_admin: true
      });

    } catch (error) {
        console.error('Error updating completion status', error);
    }
  };


  return (
    <div>
      <Navbar /> {/* Add Navbar here */}
      <h2>Company Setup</h2>

      {/* <div className="company-setup-container"> */}
      {/* <h2>Company Setup</h2> */}
      <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

      <div className="company-setup-container">
        {activeStep === 0 && (
          <div className="company-form-container">
            <h3>Admin Info</h3>
            <div className="form-group">
              <label>Admin Name:</label>
              <input
                type="text"
                name="adminName"
                value={formValues.adminName}
                onChange={handleChange}
                required
              />
              {errors.adminName && <span className="error">{errors.adminName}</span>}
            </div>
            <div className="form-group">
              <label>Admin Email:</label>
              <input
                type="email"
                name="adminEmail"
                value={formValues.adminEmail}
                onChange={handleChange}
                required
              />
              {errors.adminEmail && <span className="error">{errors.adminEmail}</span>}
            </div>
            <div className="form-group">
              <label>Admin Phone Number:</label>
              <input
                type="text"
                name="adminPhoneNum"
                value={formValues.adminPhoneNum}
                onChange={handleChange}
                required
              />
              {errors.adminPhoneNum && <span className="error">{errors.adminPhoneNum}</span>}
            </div>
            <Button onClick={handleNext} variant="contained" color="primary">Next</Button>
          </div>
        )}

{activeStep === 1 && (
  <div className="company-form-container">
    <h3>Company Info</h3>
    
    {/* First Row */}
    <div className="form-row">
      <div className="form-group">
        <label>Company Name:</label>
        <input
          type="text"
          name="companyName"
          value={formValues.companyName}
          onChange={handleChange}
          required
        />
        {errors.companyName && <span className="error">{errors.companyName}</span>}
      </div>
      
      <div className="form-group">
        <label>Company Registered ID:</label>
        <input
          type="text"
          name="companyRegisteredId"
          value={formValues.companyRegisteredId}
          onChange={handleChange}
          required
        />
        {errors.companyRegisteredId && <span className="error">{errors.companyRegisteredId}</span>}
      </div>
    </div>

    {/* Second Row */}
    <div className="form-row">
      <div className="form-group">
        <label>PAN:</label>
        <input
          type="text"
          name="pan"
          value={formValues.pan}
          onChange={handleChange}
          required
        />
        {errors.pan && <span className="error">{errors.pan}</span>}
    </div>
      
      <div className="form-group">
        <label>TAN:</label>
        <input
          type="text"
          name="tan"
          value={formValues.tan}
          onChange={handleChange}
          required
        />
        {errors.tan && <span className="error">{errors.tan}</span>}
      </div>
    </div>

    {/* Third Row */}
    <div className="form-row">
      <div className="form-group">
        <label>GST:</label>
        <input
          type="text"
          name="gst"
          value={formValues.gst}
          onChange={handleChange}
          required
        />
        {errors.gst && <span className="error">{errors.gst}</span>}
      </div>
      
      <div className="form-group">
        <label>Company Address:</label>
        <input
          type="text"
          name="address"
          value={formValues.address}
          onChange={handleChange}
          required
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>
    </div>

    {/* Fourth Row */}
    <div className="form-row">
      <div className="form-group">
        <label>COI:</label>
        <input type="file" name="coi" onChange={handleFileChange} />
        {errors.coi && <span className="error">{errors.coi}</span>}
      </div>
      
      <div className="form-group">
        <label>Logo:</label>
        <input type="file" name="logo" onChange={handleFileChange} />
        {errors.logo && <span className="error">{errors.logo}</span>}
      </div>
    </div>

    <Button onClick={handleBack} variant="contained" sx={{ mr: 2 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>

    {/* <Button onClick={handleBack}>Back</Button>
    <Button onClick={handleNext} variant="contained" color="primary">Next</Button> */}
  </div>
)}


        {activeStep === 2 && (
          <div className="company-form-container">
            <h3>Organizational Rules</h3>
            <div className="form-group">
              <label>Leave Policy:</label>
              <input type="file" name="leavePolicy" onChange={handleFileChange} required />
              {errors.leavePolicy && <span className="error">{errors.leavePolicy}</span>}
            </div>
            <div className="form-group">
              <label>PF Policy:</label>
              <input type="file" name="pfPolicy" onChange={handleFileChange} required />
              {errors.pfPolicy && <span className="error">{errors.pfPolicy}</span>}
            </div>
            <div className="form-group">
              <label>Labour Law Licence:</label>
              <input type="file" name="labourLawLicence" onChange={handleFileChange} required />
              {errors.labourLawLicence && <span className="error">{errors.labourLawLicence}</span>}
            </div>
            <Button onClick={handleBack} variant="contained" sx={{ mr: 2 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            {/* <Button onClick={handleBack}>Back</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button> */}
            {message && <p>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySetup;
