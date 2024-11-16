import React, { useState, useEffect  } from 'react';
import { TextField, Button, MenuItem, Box, FormHelperText } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Navbar from '../pages/Navbar';
import '../styles/EmployeeSetup2.css';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import Test from './Test';
import SocialSecurityDetailsForm from './SocialSecurityDetailsForm';


const steps = [
  'Work Details',
  'Social Security Details',
  'Personal Details',
  'Insurance Details',
  'Salary Details'
];

function EmployeeSetup2({ isEditMode = false}) {
  const [activeStep, setActiveStep] = useState(0);
  const [isDataLoaded,setDataload]=useState(false);
//   const [formData, setFormData] = useState({});
const [formData, setFormData] = useState({
    work_details: {},
    social_security_details: {},
    personal_details: {},
    insurance_details: {},
    salary_details: {},
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const employeeData = location.state?.employeeData;
  console.log("EData:",employeeData);

  useEffect(() => {
    if ( employeeData) {
        console.log("HELLO");
      setFormData((prevFormData) => ({
        ...prevFormData,
        work_details: { ...employeeData.work_details },
        social_security_details: { ...employeeData.social_security_details },
        personal_details: { ...employeeData.personal_details },
        insurance_details: { ...employeeData.insurance_details },
        salary_details: { ...employeeData.salary_details },
      }));
      
    }
    setDataload(true);
  }, [ employeeData]);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleChange = (e,suffix) => {
    // setFormData({ ...formData,[formData.work_details.empId]: e.target.value });
    console.log(suffix)
    setFormData((prevFormData) => ({
      ...prevFormData,
      [suffix]: { ...prevFormData[suffix],[e.target.name]: e.target.value },
    }));
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    console.log(formData)
  };


  const validateStep = (step) => {
    let stepErrors = {};
    
    const isAlpha = (str) => /^[A-Za-z\s]+$/.test(str);
    const isAlphanumeric = (str) => /^[A-Za-z0-9\s]+$/.test(str);
    const isEmail = (str) => /\S+@\S+\.\S+/.test(str);
    const isPhone = (str) => /^\d{10}$/.test(str);

    switch (step) {
      case 0:
        // empId: Alphanumeric
        if (!formData.work_details.empId || !isAlphanumeric(formData.work_details.empId)) stepErrors.empId = 'Employee ID must be alphanumeric';
        
        // First Name and Last Name: Alphabetic only
        if (!formData.work_details.firstName || !isAlpha(formData.work_details.firstName)) stepErrors.firstName = 'First Name must contain only letters';
        if (!formData.work_details.lastName || !isAlpha(formData.work_details.lastName)) stepErrors.lastName = 'Last Name must contain only letters';
        
        // Employment Status: Check if filled
        if (!formData.work_details.employmentStatus) stepErrors.employmentStatus = 'Employment Status is required';
        
        // Company Email ID: Email format
        if (!formData.work_details.companyEmailId || !isEmail(formData.work_details.companyEmailId)) stepErrors.companyEmailId = 'Please enter a valid email';
        
        if (formData.work_details.group && !/^[A-Za-z\s]+$/.test(formData.work_details.group)) {
            stepErrors.group = 'Group must contain only letters';
          }
                  
        if (!formData.work_details.department || !isAlpha(formData.work_details.department)) stepErrors.department = 'Department must contain only letters';
        
        if (formData.work_details.roleType && !/^[A-Za-z\s]+$/.test(formData.work_details.roleType)) {
            stepErrors.roleType = 'Role Type must contain only letters';
          }

        if (!formData.work_details.currentRole || !isAlpha(formData.work_details.currentRole)) stepErrors.currentRole = 'Current Role must contain only letters';
        if (!formData.work_details.reportingManager || !isAlpha(formData.work_details.reportingManager)) stepErrors.reportingManager = 'Reporting Manager must contain only letters';
        if (formData.work_details.previousEmployer && !/^[A-Za-z\s]+$/.test(formData.work_details.previousEmployer)) {
            stepErrors.previousEmployer = 'Previous Employer must contain only letters';
        }
       // Experience Before Joining: Alphanumeric (only if provided)
        if (formData.work_details.totalExpBeforeJoining && !/^[A-Za-z0-9\s]+$/.test(formData.work_details.totalExpBeforeJoining)) {
            stepErrors.totalExpBeforeJoining = 'Experience Before Joining must be alphanumeric';
        }
        
        // Reason for Leaving: Alphabetic only and limit to 255 chars (only if provided)
        if (formData.work_details.reasonForLeaving) {
            if (!/^[A-Za-z\s]+$/.test(formData.work_details.reasonForLeaving)) {
            stepErrors.reasonForLeaving = 'Reason for Leaving must contain only letters';
            }
            if (formData.work_details.reasonForLeaving.length > 255) {
            stepErrors.reasonForLeaving = 'Reason for Leaving cannot exceed 255 characters';
            }
        }
  
        // Date of Joining: Check if filled
        if (!formData.work_details.dateOfJoining) stepErrors.dateOfJoining = 'Date of Joining is required';

        // Add your form submission logic here
        
        break;
        
      case 1: 
      // PAN Number: Format - 5 letters + 4 digits + 1 letter
      if (formData.social_security_details.panNum && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.social_security_details.panNum)) {
        stepErrors.panNum = 'PAN Number must follow the format: XXXXX9999X';
      }

      // IFSC Code: Format - 4 letters + 6 digits
      if (formData.social_security_details.ifscCode && !/^[A-Z]{4}[0-9]{6}$/.test(formData.social_security_details.ifscCode)) {
        stepErrors.ifscCode = 'IFSC Code must follow the format: XXXX012345';
      }

      // Aadhar Number: 12 digits
      if (formData.social_security_details.aadharNum && !/^\d{12}$/.test(formData.social_security_details.aadharNum)) {
        stepErrors.aadharNum = 'Aadhar Number must be exactly 12 digits';
      }

      // Bank Name: Alphabetic only
      if (formData.social_security_details.bankName && !/^[A-Za-z\s]+$/.test(formData.social_security_details.bankName)) {
        stepErrors.bankName = 'Bank Name must contain only letters';
      }

      // UAN Number: 12 digits
      if (formData.social_security_details.uanNum && !/^\d{12}$/.test(formData.social_security_details.uanNum)) {
        stepErrors.uanNum = 'UAN Number must be exactly 12 digits';
      }

      // Bank Account Number: Alphanumeric, 10-16 characters
      if (formData.social_security_details.bankAccountNumber && !/^[A-Za-z0-9]{10,16}$/.test(formData.social_security_details.bankAccountNumber)) {
        stepErrors.bankAccountNumber = 'Bank Account Number must be alphanumeric and between 10 to 16 characters';
      }

      break;

      case 2: 
      // Personal Email: Valid email format
       if (!formData.personal_details.personalEmailId || !isEmail(formData.personal_details.personalEmailId)) stepErrors.personalEmailId = 'Invalid email format';
       
      if (!formData.personal_details.dob) stepErrors.dob = 'Date of Birth is required';

      // Gender: Must be selected
      if (!formData.personal_details.gender)stepErrors.gender = 'Gender is required';
      
      // Marital Status: Must be selected
      if (!formData.personal_details.maritalStatus)stepErrors.maritalStatus = 'Marital Status is required';
      
     // Educational Qualification: Optional, only letters and spaces if provided
        if (formData.personal_details.educationalQualification && !/^[A-Za-z\s]+$/.test(formData.personal_details.educationalQualification)) {
            stepErrors.educationalQualification = 'Educational Qualification must contain only letters';
        }
        
        // Marriage Date: Optional, must be a valid date if provided
        // if (formData.personal_details.marriageDate && !formData.personal_details.marriageDate.isValid()) {
        //     stepErrors.marriageDate = 'Marriage date must be a valid date';
        // }
      //   if (formData.personal_details.marriageDate && 
      //     !dayjs(formData.personal_details.marriageDate).isValid()) {
      //   stepErrors.marriageDate = 'Marriage date must be a valid date';
      // }
        
        // Blood Group: Optional, must be selected if provided
        if (formData.personal_details.bloodGroup && !formData.personal_details.bloodGroup) {
            stepErrors.bloodGroup = 'Blood Group is required';
        }
        
        // Shirt Size: Optional, must be alphabetic if provided
        if (formData.personal_details.shirtSize && !/^[A-Za-z]+$/.test(formData.personal_details.shirtSize)) {
            stepErrors.shirtSize = 'Shirt Size must be alphabetic';
        }
        
      // Current Address: Cannot be empty
       if (!formData.personal_details.currentAddress || !isAlphanumeric(formData.personal_details.currentAddress)) stepErrors.currentAddress = 'Current Address is required';
       
      // Permanent Address: Cannot be empty
       if (!formData.personal_details.permanentAddress || !isAlphanumeric(formData.personal_details.permanentAddress)) stepErrors.permanentAddress = 'Permanent Address is required';
       
      // General Contact: Valid phone number (10 digits)
       if (!formData.personal_details.generalContact || !isPhone(formData.personal_details.generalContact)) stepErrors.generalContact = 'General Contact must be a valid 10-digit phone number';

      // Emergency Contact: Valid phone number (10 digits)
      if (!formData.personal_details.emergencyContact || !isPhone(formData.personal_details.emergencyContact)) stepErrors.emergencyContact = 'Emergency Contact must be a valid 10-digit phone number';

      // Relationship: Must be selected
      if (!formData.personal_details.relationship) stepErrors.relationship = 'Relationship is required';
      
      // Relationship Name: Only alphabetic characters
       if (!formData.personal_details.relationshipName || !isAlpha(formData.personal_details.relationshipName )) stepErrors.relationshipName  = 'Relationship Name must contain only letters';
            
      // Work Location: Cannot be empty
      if (!formData.personal_details.location || !isAlpha(formData.personal_details.location )) stepErrors.location  = 'Work Location is required';
 
     break;

      case 3:
        if (formData.insurance_details.fathersName && !/^[A-Za-z\s]+$/.test(formData.insurance_details.fathersName)) {
            stepErrors.fathersName = 'Father Name must contain only letters';
        }

        // if (formData.insurance_details.fathersDOB && !formData.insurance_details.fathersDOB.isValid()) {
        //     stepErrors.fathersDOB = 'Father DOB must be a valid date';
        // }
       
        if (formData.insurance_details.mothersName && !/^[A-Za-z\s]+$/.test(formData.insurance_details.mothersName)) {
            stepErrors.mothersName = 'Father Name must contain only letters';
        }

        // if (formData.insurance_details.mothersDOB && !formData.insurance_details.mothersDOB.isValid()) {
        //     stepErrors.mothersDOB = 'Father DOB must be a valid date';
        // }
        if (formData.insurance_details.spouseName && !/^[A-Za-z\s]+$/.test(formData.insurance_details.spouseName)) {
            stepErrors.spouseName = 'Father Name must contain only letters';
        }

        // if (formData.insurance_details.spouseDOB && !formData.insurance_details.spouseDOB.isValid()) {
        //     stepErrors.spouseDOB = 'Father DOB must be a valid date';
        // }
        if (formData.insurance_details.child1 && !/^[A-Za-z\s]+$/.test(formData.insurance_details.child1)) {
            stepErrors.child1 = 'Father Name must contain only letters';
        }

        // if (formData.insurance_details.child1DOB && !formData.insurance_details.child1DOB.isValid()) {
        //     stepErrors.child1DOB = 'Father DOB must be a valid date';
        // }
        if (formData.insurance_details.child2 && !/^[A-Za-z\s]+$/.test(formData.insurance_details.child2)) {
            stepErrors.child2 = 'Father Name must contain only letters';
        }

        // if (formData.insurance_details.child2DOB && !formData.insurance_details.child2DOB.isValid()) {
        //     stepErrors.child2DOB = 'Father DOB must be a valid date';
        // }

      //   if (formData.insurance_details.fathersDOB && !dayjs(formData.insurance_details.fathersDOB).isValid()) {
      //     stepErrors.fathersDOB = 'Father DOB must be a valid date';
      // }
      // if (formData.insurance_details.mothersDOB && !dayjs(formData.insurance_details.mothersDOB).isValid()) {
      //     stepErrors.mothersDOB = 'Mother DOB must be a valid date';
      // }
      // if (formData.insurance_details.spouseDOB && !dayjs(formData.insurance_details.spouseDOB).isValid()) {
      //     stepErrors.spouseDOB = 'Spouse DOB must be a valid date';
      // }
      // if (formData.insurance_details.child1DOB && !dayjs(formData.insurance_details.child1DOB).isValid()) {
      //     stepErrors.child1DOB = 'Child 1 DOB must be a valid date';
      // }
      // if (formData.insurance_details.child2DOB && !dayjs(formData.insurance_details.child2DOB).isValid()) {
      //     stepErrors.child2DOB = 'Child 2 DOB must be a valid date';
      // }
      

      default:
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const formatDate = (date) => {
    if (!date) return null; // If date is not provided, return null
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const handleSubmit = async () => {
    const company_id = localStorage.getItem('companyId');
    if (!company_id) {
      console.error('Company ID not found');
      message.error('Company ID is required');
      return;
    }
  
    // Group form data into respective categories with formatted dates
    const workDetails = {
      empId: formData.empId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      employmentStatus: formData.employmentStatus,
      companyEmailId: formData.companyEmailId,
      group: formData.group,
      department: formData.department,
      roleType: formData.roleType,
      currentRole: formData.currentRole,
      reportingManager: formData.reportingManager,
      previousEmployer: formData.previousEmployer,
      totalExpBeforeJoining: formData.totalExpBeforeJoining,
      reasonForLeaving: formData.reasonForLeaving,
      dateOfJoining: formatDate(formData.dateOfJoining),
      dateOfRelieving: formatDate(formData.dateOfRelieving),
      previousDateOfJoining: formatDate(formData.previousDateOfJoining),
    };
  
    const socialSecurityDetails = {
      panNum: formData.panNum,
      aadharNum: formData.aadharNum,
      bankAccountNumber: formData.bankAccountNumber,
      bankName: formData.bankName,
      ifscCode: formData.ifscCode,
      uanNum: formData.uanNum
    };
  
    const personalDetails = {
      personalEmailId: formData.personalEmailId,
      dob: formatDate(formData.dob),
      gender: formData.gender,
      educationalQualification: formData.educationalQualification,
      maritalStatus: formData.maritalStatus,
      marriageDate: formatDate(formData.marriageDate),
      bloodGroup: formData.bloodGroup,
      shirtSize: formData.shirtSize,
      currentAddress: formData.currentAddress,
      permanentAddress: formData.permanentAddress,
      generalContact: formData.generalContact,
      emergencyContact: formData.emergencyContact,
      relationship: formData.relationship,
      relationshipName: formData.relationshipName,
      location: formData.location
    };
  
    const insuranceDetails = {
      fathersName: formData.fathersName,
      fathersDOB: formatDate(formData.fathersDOB),
      mothersName: formData.mothersName,
      mothersDOB: formatDate(formData.mothersDOB),
      spouseName: formData.spouseName,
      spouseDOB: formatDate(formData.spouseDOB),
      child1: formData.child1,
      child1DOB: formatDate(formData.child1DOB),
      child2: formData.child2,
      child2DOB: formatDate(formData.child2DOB),
    };
  
    const salaryDetails = {
      salary: formData.salary
    };
  
    const dataToSubmit = {
      company: company_id,
      work_details: workDetails,
      social_security_details: socialSecurityDetails,
      personal_details: personalDetails,
      insurance_details: insuranceDetails,
      salary_details: salaryDetails
    };

    
    try {
        const url = isEditMode
          ? `http://localhost:8000/api/employee/${employeeData.id}/`
          : 'http://localhost:8000/api/employee/';
        const response = await axios({
          method: isEditMode ? 'patch' : 'post',
          url,
          data: dataToSubmit,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        if (response.status === 200 || response.status === 201) {
            message.success(`Employee details ${isEditMode ? 'updated' : 'submitted'} successfully`);
            navigate('/employeelist');
      }
    } catch (error) {
        message.error(`Error ${isEditMode ? 'updating' : 'submitting'} employee details`);
        console.error(error);
    }
  }; 

  const renderFormFields = (step) => {

    const check=formData.work_details.empId;
    switch (step) {
      case 0:
        return (
          <div className="employee-setup-form">
            <TextField
              label="Employee ID"
              name="empId"
              defaultValue={formData.work_details.empId}
              value={formData.work_details.empId}
              onChange={(e)=>{handleChange(e,"work_details")}}
              fullWidth
              error={!!errors.empId}
              helperText={errors.empId}
              required
                        
            />
            <TextField
              label="First Name"
              name="firstName"
              value={formData.work_details.firstName}
              onChange={(e)=>{handleChange(e,"work_details")}}
              defaultValue={formData.work_details.firstName}
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              defaultValue={formData.work_details.lastName}
              value={formData.work_details.lastName}
              onChange={(e)=>{handleChange(e,"work_details")}}
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
            />
            <TextField
              select
              label="Employment Status"
              name="employmentStatus"
              defaultValue={formData.work_details.employmentStatus}
              value={formData.work_details.employmentStatus}
              onChange={(e)=>{handleChange(e,"work_details")}}
              fullWidth
              error={!!errors.employmentStatus}
              helperText={errors.employmentStatus}
              required>
                <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="terminated">Terminated</MenuItem>
                </TextField>
          
            <TextField
              label="Company Email ID"
              name="companyEmailId"
              defaultValue={formData.work_details.companyEmailId}
              value={formData.work_details.companyEmailId}
              onChange={(e)=>{handleChange(e,"work_details")}}
              fullWidth
              error={!!errors.companyEmailId}
              helperText={errors.companyEmailId}
              required
            />
            
            <TextField 
            label="Group" 
            name="group" 
            defaultValue={formData.work_details.group}
            value={formData.work_details.group}
            onChange={(e)=>{handleChange(e,"work_details")}}
            fullWidth
            error={!!errors.group}
            helperText={errors.group}
            />

            <TextField
              label="Department"
              name="department"
              defaultValue={formData.work_details.department}
              value={formData.work_details.department}
              onChange={(e)=>{handleChange(e,"work_details")}}
              fullWidth
              error={!!errors.department}
              helperText={errors.department}
              required
            />
             <TextField
              label="Role Type"
              name="roleType"
              defaultValue={formData.work_details.roleType}
              onChange={(e)=>{handleChange(e,"work_details")}}
              fullWidth
              value={formData.work_details.roleType}
              error={!!errors.roleType}
              helperText={errors.roleType}
            />
            <TextField
              label="Current Role"
              name="currentRole"
              defaultValue={formData.work_details.currentRole}
              value={formData.work_details.currentRole}
              onChange={(e)=>{handleChange(e,"work_details")}}
              fullWidth
              error={!!errors.currentRole}
              helperText={errors.currentRole}
              required
            />
            <TextField
              label="Reporting Manager"
              name="reportingManager"
              defaultValue={formData.work_details.reportingManager}
              value={formData.work_details.reportingManager}
              onChange={(e)=>{handleChange(e,"work_details")}}
              fullWidth
              error={!!errors.reportingManager}
              helperText={errors.reportingManager}
              required
            />
            <TextField 
              label="Previous Employer" 
              name="previousEmployer" 
              defaultValue={formData.work_details.previousEmployer}
              value={formData.work_details.previousEmployer}
              fullWidth
              error={!!errors.previousEmployer}
              helperText={errors.previousEmployer} 
              onChange={(e)=>{handleChange(e,"work_details")}}
              />
            <TextField 
            label="Experience Before Joining" 
            name="totalExpBeforeJoining" 
            defaultValue={formData.work_details.totalExpBeforeJoining}
            value={formData.work_details.totalExpBeforeJoining}
            error={!!errors.totalExpBeforeJoining}
            helperText={errors.totalExpBeforeJoining}
            fullWidth
            onChange={(e)=>{handleChange(e,"work_details")}}
            placeholder='Ex: 2 yr 5 mon'
            />
            <TextField 
            label="Reason for Leaving" 
            name="reasonForLeaving" 
            value={formData.work_details.reasonForLeaving}
            error={!!errors.reasonForLeaving}
            helperText={errors.reasonForLeaving}
            onChange={(e)=>{handleChange(e,"work_details")}}
            fullWidth
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Joining"
                value={formData.work_details.dateOfJoining}
                // defaultValue={formData.work_details.dateOfJoining}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  work_details: { ...prevFormData.work_details, dateOfJoining: date },
                }))}
                renderInput={(params) => (
                  <TextField {...params} fullWidth error={!!errors.dateOfJoining} helperText={errors.dateOfJoining} 
                  required 
                  />
                )}
              />

              <DatePicker
                label="Date of Relieving"
                value={formData.work_details.dateOfRelieving}
                // defaultValue={formData.work_details.dateOfRelieving}
                // onChange={(date) => setFormData({ ...formData, dateOfRelieving: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  work_details: { ...prevFormData.work_details, dateOfRelieving: date },
                }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="Previous Date of Joining"
                value={formData.work_details.previousDateOfJoining}
                // defaultValue={formData.work_details.previousDateOfJoining}
                // onChange={(date) => setFormData({ ...formData, previousDateOfJoining: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  work_details: { ...prevFormData.work_details, previousDateOfJoining: date },
                }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
           
          </div>
        );

      case 1: // Social Security Details Form
        return (
        <div className="employee-setup-form">
        <SocialSecurityDetailsForm
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          </div>
        );

      case 2: // Personal Details Form
        return (
          <div className="employee-setup-form">
            <TextField
              label="Personal Email ID"
              name="personalEmailId"
              defaultValue={formData.personal_details.personalEmailId}
              value={formData.personal_details.personalEmailId }
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.personalEmailId}
              helperText={errors.personalEmailId}
              required
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth *"
                value={formData.personal_details.dob}
                // defaultValue={formData.personal_details.dob}
                // onChange={(date) => setFormData({ ...formData, dob: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  personal_details: { ...prevFormData.personal_details, dob: dayjs(date) },
                }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
                error={!!errors.dob}
                helperText={errors.dob}
                required
              />
            </LocalizationProvider> */}
            <TextField
              select
              label="Gender"
              name="gender"
              defaultValue={formData.personal_details.gender}
              value={formData.personal_details.gender}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.gender}
              helperText={errors.gender}
              required
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              label="Educational Qualification"
              name="educationalQualification"
              defaultValue={formData.personal_details.educationalQualification}
              value={formData.personal_details.educationalQualification}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.educationalQualification}
              helperText={errors.educationalQualification}
            />
            <TextField
              select
              label="Marital Status"
              name="maritalStatus"
              defaultValue={formData.personal_details.maritalStatus}
              value={formData.personal_details.maritalStatus}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.maritalStatus}
              helperText={errors.maritalStatus}
              required
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker
                label="Marriage Date"
                value={formData.personal_details.marriageDate}
                // defaultValue={formData.personal_details.marriageDate}
                // onChange={(date) => setFormData({ ...formData, marriageDate: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  personal_details: { ...prevFormData.personal_details, marriageDate: dayjs(date) },
                }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
                error={!!errors.marriageDate}
                helperText={errors.marriageDate}
              /> */}

<DatePicker
  label="Marriage Date"
  value={formData.personal_details.marriageDate ? dayjs(formData.personal_details.marriageDate) : null}
  onChange={(date) => setFormData((prevFormData) => ({
    ...prevFormData,
    personal_details: {
      ...prevFormData.personal_details,
      marriageDate: date, // This will be a dayjs object directly from the picker
    },
  }))}
  renderInput={(params) => <TextField {...params} fullWidth />}
  error={!!errors.marriageDate}
  helperText={errors.marriageDate}
/>
            </LocalizationProvider>
              <TextField
              select
              label="Blood Group"
              name="bloodGroup"
              defaultValue={formData.personal_details.bloodGroup}
              value={formData.personal_details.bloodGroup}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.bloodGroup}
              helperText={errors.bloodGroup}
            >
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
            </TextField>
            <TextField
              label="Shirt Size"
              name="shirtSize"
              defaultValue={formData.personal_details.shirtSize}
              value={formData.personal_details.shirtSize}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.shirtSize}
              helperText={errors.shirtSize}
            />
            <TextField
              label="Current Address"
              name="currentAddress"
              defaultValue={formData.personal_details.currentAddress}
              value={formData.personal_details.currentAddress}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.currentAddress}
              helperText={errors.currentAddress}
              required
            />
            <TextField
              label="Permanent Address"
              name="permanentAddress"
              defaultValue={formData.personal_details.permanentAddress}
              value={formData.personal_details.permanentAddress}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.permanentAddress}
              helperText={errors.permanentAddress}
              required
            />
            <TextField
              label="General Contact (10 digits)"
              name="generalContact"
              defaultValue={formData.personal_details.generalContact}
              value={formData.personal_details.generalContact}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.generalContact}
              helperText={errors.generalContact}
              required
            />
            <TextField
              label="Emergency Contact (10 digits)"
              name="emergencyContact"
              defaultValue={formData.personal_details.emergencyContact}
              value={formData.personal_details.emergencyContact}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.emergencyContact}
              helperText={errors.emergencyContact}
              required
            />
            <TextField
              select
              label="Relationship"
              name="relationship"
              defaultValue={formData.personal_details.relationship}
              value={formData.personal_details.relationship}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.relationship}
              helperText={errors.relationship}
              required
            >
              <MenuItem value="Parent">Parent</MenuItem>
              <MenuItem value="Sibling">Sibling</MenuItem>
              <MenuItem value="Spouse">Spouse</MenuItem>
              <MenuItem value="Friend">Friend</MenuItem>
            </TextField>
            <TextField
              label="Relationship Name"
              name="relationshipName"
              defaultValue={formData.personal_details.relationshipName}
              value={formData.personal_details.relationshipName}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.relationshipName}
              helperText={errors.relationshipName}
              required
            />
            <TextField
              label="Work Location"
              name="location"
              defaultValue={formData.personal_details.location}
              value={formData.personal_details.location || ''}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.location}
              helperText={errors.location}
              required
            />
          </div>
        );

      case 3:
        return (
            <div className="employee-setup-form">
            <TextField
                label="Father Name"
                name="fathersName"
                defaultValue={formData.insurance_details.fathersName}
                value={formData.insurance_details.fathersName}
                onChange={(e)=>{handleChange(e,"personal_details")}}
                fullWidth
                error={!!errors.fathersName}
                helperText={errors.fathersName}
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Father DOB"
                value={formData.insurance_details.fathersDOB}
                // defaultValue={formData.insurance_details.fathersDOB}
                // onChange={(date) => setFormData({ ...formData, fathersDOB: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  insurance_details: { ...prevFormData.insurance_details, fathersDOB: dayjs(date) },
                }))}
                renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!errors.fathersDOB} helperText={errors.fathersDOB} />
                )}
                />
            </LocalizationProvider> */}

            <TextField
                label="Mother Name"
                name="mothersName"
                defaultValue={formData.insurance_details.mothersName}
                value={formData.insurance_details.mothersName}
                onChange={(e)=>{handleChange(e,"personal_details")}}
                fullWidth
                error={!!errors.mothersName}
                helperText={errors.mothersName}
            />
           {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Mother DOB"
                value={formData.insurance_details.mothersDOB}
                // defaultValue={formData.insurance_details.mothersDOB}
                // onChange={(date) => setFormData({ ...formData, mothersDOB: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  insurance_details: { ...prevFormData.insurance_details, mothersDOB: dayjs(date) },
                }))}
                renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!errors.mothersDOB} helperText={errors.mothersDOB} />
                )}
                />
            </LocalizationProvider> */}

            <TextField
                label="Spouse Name"
                name="spouseName"
                defaultValue={formData.insurance_details.spouseName}
                value={formData.insurance_details.spouseName}
                onChange={(e)=>{handleChange(e,"personal_details")}}
                fullWidth
                error={!!errors.spouseName}
                helperText={errors.spouseName}
            />            
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Spouse DOB"
                // defaultValue={formData.insurance_details.spouseDOB}
                value={formData.insurance_details.spouseDOB}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  insurance_details: { ...prevFormData.insurance_details, spouseDOB: dayjs(date) },
                }))}
                // onChange={(date) => setFormData({ ...formData, spouseDOB: date })}
                renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!errors.spouseDOB} helperText={errors.spouseDOB} />
                )}
                />
            </LocalizationProvider> */}

            <TextField
                label="Child1 Name"
                name="child1"
                defaultValue={formData.insurance_details.child1}
                value={formData.insurance_details.child1}
                onChange={(e)=>{handleChange(e,"personal_details")}}
                fullWidth
                error={!!errors.child1}
                helperText={errors.child1}
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Child1 DOB"
                value={formData.insurance_details.child1Dob}
                // defaultValue={formData.insurance_details.child1DOB}
                // onChange={(date) => setFormData({ ...formData, child1DOB: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  insurance_details: { ...prevFormData.insurance_details, child1DOB: dayjs(date) },
                }))}
                renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!errors.child1DOB} helperText={errors.child1DOB} />
                )}
                />
            </LocalizationProvider> */}

            <TextField
                label="Child2 Name"
                name="child2"
                defaultValue={formData.insurance_details.child2}
                value={formData.insurance_details.child2}
                onChange={(e)=>{handleChange(e,"personal_details")}}
                fullWidth
                error={!!errors.child2}
                helperText={errors.child2}
            />

            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Child2 DOB"
                value={formData.child2DOB}
                // defaultValue={formData.insurance_details.child2DOB}
                // onChange={(date) => setFormData({ ...formData, child2DOB: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  insurance_details: { ...prevFormData.insurance_details, child2DOB: dayjs(date) },
                }))}
                renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!errors.child2DOB} helperText={errors.child2DOB} />
                )}
                />
            </LocalizationProvider> */}
            </div>
        );

      // Other steps remain unchanged
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <Box className="employee-setup-container">
        <Stepper activeStep={activeStep} alternativeLabel className="employee-setup-stepper">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
  
        <Box sx={{ mt: 2, mb: 2 }}>
          {isDataLoaded && renderFormFields(activeStep)}
        </Box>
  
        <Box className="employee-setup-button-container">
          {activeStep !== 0 && (
            <Button onClick={handleBack} className="back-button">
              Back
            </Button>
          )}
  
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleSubmit} className="submit-button">
                {isEditMode ? 'Update' : 'Submit'}            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
  
}

export default EmployeeSetup2;
