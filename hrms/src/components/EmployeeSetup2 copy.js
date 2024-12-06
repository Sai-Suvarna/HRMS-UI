import React, { useState, useEffect  } from 'react';
import { Button, Box } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Navbar from '../pages/Navbar';
import '../styles/EmployeeSetup2.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import SocialSecurityDetailsForm from './SocialSecurityDetailsForm';
import EmployeeWorkDetailsForm from './EmployeeWorkDetailsForm';
import PersonalDetailsFields from './PersonalDetailsFields'; 
import InsuranceDetailsForm from './InsuranceDetailsForm';
import api from "../api";
import { Modal, message } from 'antd';
import dayjs from 'dayjs';


const steps = [
  'Work Details',
  'Social Security Details',
  'Personal Details',
  'Insurance Details',
  'Salary Details'
];

function EmployeeSetup2() {
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
  const [rehireMode, setRehireMode] = useState(false);
  const { employeeData, isEditMode = false, isRehireMode = false } = location.state || {};
  const [empIdExists, setEmpIdExists] = useState(false);
  const [newEmpId, setNewEmpId] = useState('');
  console.log("EData:",employeeData);
  console.log("Edit Mode:",isEditMode);

  useEffect(() => {
    if (employeeData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        work_details: { ...employeeData.work_details },
        social_security_details: { ...employeeData.social_security_details },
        personal_details: { ...employeeData.personal_details },
        insurance_details: { ...employeeData.insurance_details },
        salary_details: { ...employeeData.salary_details },
      }));
    }
    if (isRehireMode) {
      setRehireMode(true);
    }
    setDataload(true);
  }, [employeeData, isRehireMode]);

const formatToLocalDate = (date) => {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().split('T')[0];
};

const handleRehire = async () => {
  try {
    console.log("ID:", formData.work_details.wdId);

    const response = await api.get(`/api/employee/${formData.work_details.wdId}/`);

    if (response.data && response.data.work_details && response.data.work_details.empId) {
      const existingEmpId = response.data.work_details.empId;
      console.log("existingEmpId:", existingEmpId);
      console.log("formData:", formData.work_details.empId);

      const previousJoiningDate = response.data.work_details.dateOfJoining;
      console.log("Previous Joining Date:", previousJoiningDate);

      const newJoiningDate = formData.work_details.dateOfJoining;
      console.log("New Joining Date:", newJoiningDate);

      // Check for changes in employee details
      const checkForDetailsChanges = () => {
        const fieldsToCheck = [
          'department', 'currentRole', 'reportingManager', 'previousEmployer',
          'currentAddress', 'permanentAddress', 'generalContact', 'emergencyContact',
          'relationship', 'relationshipName', 'location'
        ];

        const changedFields = fieldsToCheck.filter(field => {
          const responseValue = response.data.work_details[field] || response.data.personal_details[field];
          const formDataValue = formData.work_details[field] || formData.personal_details[field];
          return responseValue !== formDataValue;
        });

        return changedFields.length > 0; // Return true if any field has changed
      };

      // Function to update the employee data
      const updateEmployeeData = async (joiningDate) => {
        const updatedFormData = {
          ...formData,
          work_details: {
            ...formData.work_details,
            previousDateOfJoining: previousJoiningDate,
            dateOfJoining: joiningDate,
            employmentStatus: 'Active',
          },
        };

        try {
          const editResponse = await api.patch(`/api/employee/${formData.work_details.wdId}/`, updatedFormData);

          if (editResponse.status === 200) {
            message.success('Employee details updated successfully.');
            navigate('/employeelist');
          }
        } catch (error) {
          console.error('Error updating employee details:', error);
          message.error('Failed to update employee details.');
        }
      };

      // Function to check the joining date
      const checkJoiningDate = async () => {
        if (newJoiningDate === previousJoiningDate || !newJoiningDate) {
          Modal.confirm({
            title: 'Joining Date Unchanged',
            content: `The joining date has not been modified. Please provide a new joining date. The current joining date will be moved to "Previous Joining Date".`,
            okText: 'Update Joining Date',
            cancelText: 'Cancel',
            onOk: async () => {
              const newDatePrompt = prompt("Enter the new joining date (YYYY-MM-DD):");
              if (!newDatePrompt || isNaN(Date.parse(newDatePrompt))) {
                message.error("Invalid date format. Please provide a valid date in YYYY-MM-DD format.");
                return;
              }

              const formattedPromptDate = formatToLocalDate(newDatePrompt);
              onDateUpdate(formattedPromptDate);
            },
            onCancel: () => {
              message.info('Joining date update canceled.');
            },
          });
        } else {
          const formattedDate = formatToLocalDate(newJoiningDate);
          onDateUpdate(formattedDate);
        }
      };

      // Function that handles date update and employee details check
      const onDateUpdate = (formattedDate) => {
        // After handling the date update, we check if any employee details have changed
        const detailsChanged = checkForDetailsChanges();

        if (detailsChanged) {
          Modal.confirm({
            title: 'Employee Details Changed',
            content: 'Some employee details have changed. Do you want to proceed with the new data?',
            okText: 'Yes, Proceed with Changes',
            cancelText: 'No, Cancel',
            onOk: () => {
              updateEmployeeData(formattedDate); 
            },
            onCancel: () => {
              message.info('Action canceled');
            },
          });
        } else {
          Modal.confirm({
            title: 'Employee Details Unchanged',
            content: 'No changes have been made to the employee details. Do you want to continue with the same data?',
            okText: 'Yes, Continue',
            cancelText: 'No, Cancel',
            onOk: () => {
              updateEmployeeData(formattedDate); // Proceed with updating employee data
            },
            onCancel: () => {
              message.info('Action canceled');
            },
          });
        }
      };

      // First check: empId
      if (existingEmpId === formData.work_details.empId) {
        Modal.confirm({
          title: 'Employee ID Exists',
          content: 'Do you want to continue with the same Employee ID?',
          okText: 'Yes, Update',
          cancelText: 'No, Provide New ID',
          onOk: () => {
            // If empId matches, move to checking the joining date
            checkJoiningDate();
          },
          onCancel: () => {
            setEmpIdExists(true);
            message.warning('Please provide a new Employee ID.');
          },
        });
      } else {
        // If empId does not match, update empId and proceed
        setEmpIdExists(false);
        checkJoiningDate();
      }

    } else {
      message.error('No work details found for the given ID.');
    }
  } catch (error) {
    console.error('Error checking Employee ID:', error);
    message.error('Failed to check Employee ID.');
  }
};

  const handleEmpIdChange = (e) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      work_details: { ...prevFormData.work_details, empId: value },
    }));
    setNewEmpId(value);
  };

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
       
        if (formData.insurance_details.mothersName && !/^[A-Za-z\s]+$/.test(formData.insurance_details.mothersName)) {
            stepErrors.mothersName = 'Father Name must contain only letters';
        }

        if (formData.insurance_details.spouseName && !/^[A-Za-z\s]+$/.test(formData.insurance_details.spouseName)) {
            stepErrors.spouseName = 'Father Name must contain only letters';
        }

        if (formData.insurance_details.child1 && !/^[A-Za-z\s]+$/.test(formData.insurance_details.child1)) {
            stepErrors.child1 = 'Father Name must contain only letters';
        }

        if (formData.insurance_details.child2 && !/^[A-Za-z\s]+$/.test(formData.insurance_details.child2)) {
            stepErrors.child2 = 'Father Name must contain only letters';
        }

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
    console.log("HI HELLO")
    const company_id = localStorage.getItem('companyId');
    if (!company_id) {
      console.error('Company ID not found');
      message.error('Company ID is required');
      return;
    }


  // Format date fields while retaining all other properties
const insuranceDetails = {
  ...formData.insurance_details,
  fathersDOB: formatDate(formData.insurance_details.fathersDOB),
  mothersDOB: formatDate(formData.insurance_details.mothersDOB),
  spouseDOB: formatDate(formData.insurance_details.spouseDOB),
  child1DOB: formatDate(formData.insurance_details.child1DOB),
  child2DOB: formatDate(formData.insurance_details.child2DOB),
};

const workDetails = {
  ...formData.work_details,
  dateOfJoining: formatDate(formData.work_details.dateOfJoining),
  dateOfRelieving: formatDate(formData.work_details.dateOfRelieving),
  previousDateOfJoining: formatDate(formData.work_details.previousDateOfJoining),
};

const personalDetails = {
  ...formData.personal_details,
  dob: formatDate(formData.personal_details.dob),
  marriageDate: formatDate(formData.personal_details.marriageDate),
};

// Create data to submit
const dataToSubmit = {
  company: company_id,
  work_details: workDetails,
  social_security_details: formData.social_security_details,
  personal_details: personalDetails,
  insurance_details: insuranceDetails,
  salary_details: formData.salary_details,  
};
  console.log("Submit edit mode:",isEditMode);
  
   const id = isEditMode?employeeData.work_details.wdId:"";

  try {
    const url = isEditMode && !rehireMode ? `/api/employee/${employeeData.work_details.wdId}/` : '/api/employee/';
    console.log("URL:",url)
    const response = isEditMode && !rehireMode
      ? await api.patch(url, dataToSubmit)
      : await api.post(url, dataToSubmit);

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

    switch (step) {
      case 0:
        return (
          <div className="employee-setup-form">
      <EmployeeWorkDetailsForm 
        formData={formData} 
        errors={errors} 
        handleChange={handleChange} 
        setFormData={setFormData} 
        isRehireMode={rehireMode}
        handleEmpIdChange={handleEmpIdChange} 

      />
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
          <PersonalDetailsFields 
            formData={formData} 
            errors={errors} 
            handleChange={handleChange} 
            setFormData={setFormData} 

          />
        </div>
        );

      case 3:
        return (
          <div className='employee-setup-form'>
            <InsuranceDetailsForm 
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                setFormData={setFormData}
            />
          </div>
        );

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
            <Button
              variant="contained"
              onClick={rehireMode ? handleRehire : handleSubmit}
              className="submit-button"
            >
              {rehireMode ? 'Rehire' : isEditMode ? 'Update' : 'Submit'}
            </Button>
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
