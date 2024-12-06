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
import SalaryDetailsForm from './SalaryDetailsForm';
import api from "../api";
import { Modal, message, Input } from 'antd'; 
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import dayjs from 'dayjs';

import { fetchUserId, fetchCompanyId } from '../helpers/CompanyId';


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

  const [changeEmpId, setChangeEmpId] = React.useState(false);
  const [isJoiningDateChanged, setIsJoiningDateChanged] = useState(false); 

  const [newEmpId, setNewEmpId] = React.useState(formData.work_details.empId);
  const [newJoiningDate, setNewJoiningDate] = React.useState(dayjs(formData.work_details.dateOfJoining).format('YYYY-MM-DD'));

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

  // const handleRehire = () => {
  //   // Enable user to change empId and set form to rehire mode
  //   setRehireMode(true);
  //   message.info('Please change the Employee ID to proceed with rehire.');
  // };


// const handleRehire = async () => {
//   try {
//     console.log("ID:", formData.work_details.wdId);

//     const response = await api.get(`/api/employee/${formData.work_details.wdId}/`);

//     if (response.data && response.data.work_details && response.data.work_details.empId) {
//       const existingEmpId = response.data.work_details.empId;
//       console.log("existingEmpId:", existingEmpId);
//       console.log("formData:", formData.work_details.empId);

//       if (existingEmpId === formData.work_details.empId) {
//         // Show a confirmation dialog with Modal.confirm
//         Modal.confirm({
//           title: 'Employee ID Exists',
//           content: 'Do you want to continue with the same Employee Id?',
//           okText: 'Yes, Update',
//           cancelText: 'No, Provide New ID',
//           onOk: async () => {
//             // User confirmed to keep the same empId and update
//             try {
//               const editResponse = await api.patch(`/api/employee/${formData.work_details.wdId}/`, {
//                 ...formData,
//                 work_details: {
//                   ...formData.work_details,
//                   employmentStatus: 'active' 
//                 }
//               });

//               if (editResponse.status === 200) {
//                 message.success('Employee status updated successfully');
//                 navigate('/employeelist');
//               }
//             } catch (error) {
//               console.error('Error updating employee status:', error);
//               message.error('Failed to update employee status');
//             }
//           },
//           onCancel: () => {
//             // User chose to provide a new Employee ID
//             setEmpIdExists(true);
//             message.warning('Please provide a new Employee ID.');
//           }
//         });
//       } else {
//         setEmpIdExists(false);
//         handleSubmit(); // Call submit directly after rehire
//       }
//     } else {
//       message.error('No work details found for the given ID.');
//     }

//   } catch (error) {
//     console.error('Error checking Employee ID:', error);
//     message.error('Failed to check Employee ID.');
//   }
// };

const formatToLocalDate = (date) => {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().split('T')[0];
};
//working without details checking
// const handleRehire = async () => {
//   try {
//     console.log("ID:", formData.work_details.wdId);

//     const response = await api.get(`/api/employee/${formData.work_details.wdId}/`);

//     if (response.data && response.data.work_details && response.data.work_details.empId) {
//       const existingEmpId = response.data.work_details.empId;
//       console.log("existingEmpId:", existingEmpId);
//       console.log("formData:", formData.work_details.empId);

//       const previousJoiningDate = response.data.work_details.dateOfJoining;
//       console.log("Previous Joining Date:", previousJoiningDate);

//       const newJoiningDate = formData.work_details.dateOfJoining;
//       console.log("New Joining Date:", newJoiningDate);

//       const checkJoiningDate = async (onDateUpdate) => {
//         if (newJoiningDate === previousJoiningDate || !newJoiningDate) {
//           Modal.confirm({
//             title: 'Joining Date Unchanged',
//             content: `The joining date has not been modified. Please provide a new joining date. The current joining date will be moved to "Previous Joining Date".`,
//             okText: 'Update Joining Date',
//             cancelText: 'Cancel',
//             onOk: async () => {
//               const newDatePrompt = prompt("Enter the new joining date (YYYY-MM-DD):");
//               if (!newDatePrompt || isNaN(Date.parse(newDatePrompt))) {
//                 message.error("Invalid date format. Please provide a valid date in YYYY-MM-DD format.");
//                 return;
//               }

//               const formattedPromptDate = formatToLocalDate(newDatePrompt);
//               onDateUpdate(formattedPromptDate);
//             },
//             onCancel: () => {
//               message.info('Joining date update canceled.');
//             },
//           });
//         } else {
//           const formattedDate = formatToLocalDate(newJoiningDate);
//           onDateUpdate(formattedDate);
//         }
//       };

//       const updateEmployeeData = async (joiningDate) => {
//         const updatedFormData = {
//           ...formData,
//           work_details: {
//             ...formData.work_details,
//             previousDateOfJoining: previousJoiningDate,
//             dateOfJoining: joiningDate,
//             employmentStatus: 'active',
//           },
//         };

//         try {
//           const editResponse = await api.patch(`/api/employee/${formData.work_details.wdId}/`, updatedFormData);

//           if (editResponse.status === 200) {
//             message.success('Employee status and joining date updated successfully.');
//             navigate('/employeelist');
//           }
//         } catch (error) {
//           console.error('Error updating joining date:', error.response?.data || error.message);
//           message.error('Failed to update joining date.');
//         }
//       };

//       // If empId matches, handle rehire logic
//       if (existingEmpId === formData.work_details.empId) {
//         Modal.confirm({
//           title: 'Employee ID Exists',
//           content: 'Do you want to continue with the same Employee ID?',
//           okText: 'Yes, Update',
//           cancelText: 'No, Provide New ID',
//           onOk: () => {
//             checkJoiningDate(updateEmployeeData);
//           },
//           onCancel: () => {
//             setEmpIdExists(true);
//             message.warning('Please provide a new Employee ID.');
//           },
//         });
//       } else {
//         // Handle the case where empId is changed
//         setEmpIdExists(false);
//         checkJoiningDate(async (joiningDate) => {
//           const updatedFormData = {
//             ...formData,
//             work_details: {
//               ...formData.work_details,
//               dateOfJoining: joiningDate,
//               previousDateOfJoining: previousJoiningDate,
//               employmentStatus: 'active',
//             },
//           };

//           try {
//             const editResponse = await api.patch(`/api/employee/${formData.work_details.wdId}/`, updatedFormData);

//             if (editResponse.status === 200) {
//               message.success('Employee details updated successfully.');
//               navigate('/employeelist');
//             }
//           } catch (error) {
//             console.error('Error updating employee details:', error);
//             message.error('Failed to update employee details.');
//           }
//         });
//       }
//     } else {
//       message.error('No work details found for the given ID.');
//     }
//   } catch (error) {
//     console.error('Error checking Employee ID:', error);
//     message.error('Failed to check Employee ID.');
//   }
// };


// const handleRehire = async () => {
//   try {
//     console.log("ID:", formData.work_details.wdId);

//     const response = await api.get(`/api/employee/${formData.work_details.wdId}/`);

//     if (response.data && response.data.work_details && response.data.work_details.empId) {
//       const existingEmpId = response.data.work_details.empId;
//       console.log("existingEmpId:", existingEmpId);
//       console.log("formData:", formData.work_details.empId);

//       const previousJoiningDate = response.data.work_details.dateOfJoining;
//       console.log("Previous Joining Date:", previousJoiningDate);

//       const newJoiningDate = formData.work_details.dateOfJoining;
//       console.log("New Joining Date:", newJoiningDate);

//       // Check for changes in employee details
//       const checkForDetailsChanges = () => {
//         const fieldsToCheck = [
//           'department', 'currentRole', 'reportingManager', 'previousEmployer',
//           'currentAddress', 'permanentAddress', 'generalContact', 'emergencyContact',
//           'relationship', 'relationshipName', 'location'
//         ];

//         const changedFields = fieldsToCheck.filter(field => {
//           const responseValue = response.data.work_details[field] || response.data.personal_details[field];
//           const formDataValue = formData.work_details[field] || formData.personal_details[field];
//           return responseValue !== formDataValue;
//         });

//         return changedFields.length > 0; // Return true if any field has changed
//       };

//       // Function to update the employee data
//       const updateEmployeeData = async (joiningDate) => {
//         const updatedFormData = {
//           ...formData,
//           work_details: {
//             ...formData.work_details,
//             previousDateOfJoining: previousJoiningDate,
//             dateOfJoining: joiningDate,
//             employmentStatus: 'Active',
//           },
//         };

//         try {
//           const editResponse = await api.patch(`/api/employee/${formData.work_details.wdId}/`, updatedFormData);

//           if (editResponse.status === 200) {
//             message.success('Employee details updated successfully.');
//             navigate('/employeelist');
//           }
//         } catch (error) {
//           console.error('Error updating employee details:', error);
//           message.error('Failed to update employee details.');
//         }
//       };

//       // Function to check the joining date
//       const checkJoiningDate = async () => {
//         if (newJoiningDate === previousJoiningDate || !newJoiningDate) {
//           Modal.confirm({
//             title: 'Joining Date Unchanged',
//             content: `The joining date has not been modified. Please provide a new joining date. The current joining date will be moved to "Previous Joining Date".`,
//             okText: 'Update Joining Date',
//             cancelText: 'Cancel',
//             onOk: async () => {
//               const newDatePrompt = prompt("Enter the new joining date (YYYY-MM-DD):");
//               if (!newDatePrompt || isNaN(Date.parse(newDatePrompt))) {
//                 message.error("Invalid date format. Please provide a valid date in YYYY-MM-DD format.");
//                 return;
//               }

//               const formattedPromptDate = formatToLocalDate(newDatePrompt);
//               onDateUpdate(formattedPromptDate);
//             },
//             onCancel: () => {
//               message.info('Joining date update canceled.');
//             },
//           });
//         } else {
//           const formattedDate = formatToLocalDate(newJoiningDate);
//           onDateUpdate(formattedDate);
//         }
//       };

//       // Function that handles date update and employee details check
//       const onDateUpdate = (formattedDate) => {
//         // After handling the date update, we check if any employee details have changed
//         const detailsChanged = checkForDetailsChanges();

//         if (detailsChanged) {
//           Modal.confirm({
//             title: 'Employee Details Changed',
//             content: 'Some employee details have changed. Do you want to proceed with the new data?',
//             okText: 'Yes, Proceed with Changes',
//             cancelText: 'No, Cancel',
//             onOk: () => {
//               updateEmployeeData(formattedDate); 
//             },
//             onCancel: () => {
//               message.info('Action canceled');
//             },
//           });
//         } else {
//           Modal.confirm({
//             title: 'Employee Details Unchanged',
//             content: 'No changes have been made to the employee details. Do you want to continue with the same data?',
//             okText: 'Yes, Continue',
//             cancelText: 'No, Cancel',
//             onOk: () => {
//               updateEmployeeData(formattedDate); // Proceed with updating employee data
//             },
//             onCancel: () => {
//               message.info('Action canceled');
//             },
//           });
//         }
//       };

//       // First check: empId
//       if (existingEmpId === formData.work_details.empId) {
//         Modal.confirm({
//           title: 'Employee ID Exists',
//           content: 'Do you want to continue with the same Employee ID?',
//           okText: 'Yes, Update',
//           cancelText: 'No, Provide New ID',
//           onOk: () => {
//             // If empId matches, move to checking the joining date
//             checkJoiningDate();
//           },
//           onCancel: () => {
//             setEmpIdExists(true);
//             message.warning('Please provide a new Employee ID.');
//           },
//         });
//       } else {
//         // If empId does not match, update empId and proceed
//         setEmpIdExists(false);
//         checkJoiningDate();
//       }

//     } else {
//       message.error('No work details found for the given ID.');
//     }
//   } catch (error) {
//     console.error('Error checking Employee ID:', error);
//     message.error('Failed to check Employee ID.');
//   }
// };



const handleRehire = async () => {
  try {
    console.log("ID:", formData.work_details.wdId);

    const response = await api.get(`/api/employee/${formData.work_details.wdId}/`);

    if (response.data && response.data.work_details && response.data.work_details.empId) {
      const existingEmpId = response.data.work_details.empId;
      const existingJoiningDate = response.data.work_details.dateOfJoining;
      const formEmpId = formData.work_details.empId;
      const formJoiningDate = formData.work_details.dateOfJoining;

      console.log("existingEmpId:", existingEmpId);
      console.log("existingJoiningDate:", existingJoiningDate);
      console.log("formEmpId:", formEmpId);
      console.log("formJoiningDate:", formJoiningDate);

      const isEmpIdChanged = existingEmpId !== formEmpId;
      const isJoiningDateChanged = existingJoiningDate !== formJoiningDate;

      const updateEmployeeData = async (joiningDate, newEmpId = existingEmpId) => {
        const updatedFormData = {
          ...formData,
          work_details: {
            ...formData.work_details,
            previousDateOfJoining: existingJoiningDate,
            dateOfJoining: dayjs(joiningDate).format('YYYY-MM-DD'),
            employmentStatus: 'Active',
            empId: newEmpId,
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

      if (isEmpIdChanged || isJoiningDateChanged) {
        Modal.confirm({
          title: 'Do you wish to change the following data?',
          content: (
            <div>
              {isEmpIdChanged && (
                <p>
                  <strong>EmpId: </strong>{existingEmpId} → {formEmpId}
                </p>
              )}
              {isJoiningDateChanged && (
                <p>
                  <strong>Joining Date: </strong>{dayjs(existingJoiningDate).format('YYYY-MM-DD')} → {dayjs(formJoiningDate).format('YYYY-MM-DD')}
                </p>
              )}
            </div>
          ),
          okText: 'Yes, update',
          cancelText: 'No, cancel',
          onOk: () => {
            updateEmployeeData(formJoiningDate, formEmpId);
          },
          onCancel: () => {
            message.info('Action canceled.');
          },
        });
      } else {
        let updatedEmpId = existingEmpId;
        let updatedJoiningDate = existingJoiningDate;

        const ModalForm = () => {
          const [changeEmpId, setChangeEmpId] = React.useState(false);
          const [changeJoiningDate, setChangeJoiningDate] = React.useState(false);
          const [newEmpId, setNewEmpId] = React.useState(existingEmpId);
          const [newJoiningDate, setNewJoiningDate] = React.useState(dayjs(existingJoiningDate).format('YYYY-MM-DD'));

          return (
            <div>
              <p><strong>Current EmpId:</strong> {existingEmpId}</p>
              <p><strong>Current Joining Date:</strong> {dayjs(existingJoiningDate).format('YYYY-MM-DD')}</p>
              <FormControl>
                <FormLabel>Change EmpId?</FormLabel>
                <RadioGroup
                  value={changeEmpId ? 'yes' : 'no'}
                  onChange={(e) => setChangeEmpId(e.target.value === 'yes')}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes, change EmpId" />
                  <FormControlLabel value="no" control={<Radio />} label="No, keep existing EmpId" />
                </RadioGroup>
                {changeEmpId && (
                  <Input
                    placeholder="Enter new EmpId"
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                  />
                )}
              </FormControl>
              <br />
              <FormControl>
                <FormLabel>Change Joining Date?</FormLabel>
                <RadioGroup
                  value={changeJoiningDate ? 'yes' : 'no'}
                  onChange={(e) => setChangeJoiningDate(e.target.value === 'yes')}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes, change Joining Date" />
                  <FormControlLabel value="no" control={<Radio />} label="No, keep existing Joining Date" />
                </RadioGroup>
                {changeJoiningDate && (
                  <Input
                    type="date"
                    value={newJoiningDate}
                    onChange={(e) => setNewJoiningDate(e.target.value)}
                  />
                )}
              </FormControl>
            </div>
          );
        };

        Modal.confirm({
          title: 'Do you want to update the details?',
          content: <ModalForm />,
          okText: 'Proceed',
          cancelText: 'Cancel',
          onOk: () => {
            updateEmployeeData(updatedJoiningDate, updatedEmpId);
          },
          onCancel: () => {
            message.info('Action canceled.');
          },
        });
      }
    } else {
      message.error('No work details found for the given ID.');
    }
  } catch (error) {
    console.error('Error checking Employee ID:', error);
    message.error('Failed to check Employee ID.');
  }
};


// const handleRehire = async () => {
//   try {
//     const response = await api.get(`/api/employee/${formData.work_details.wdId}/`);

//     if (response.data && response.data.work_details && response.data.work_details.empId) {
//       const existingEmpId = response.data.work_details.empId;
//       const existingJoiningDate = response.data.work_details.dateOfJoining;
//       const formEmpId = formData.work_details.empId;
//       const formJoiningDate = formData.work_details.dateOfJoining;

//       const isEmpIdChanged = existingEmpId !== formEmpId;
//       const isJoiningDateChanged = existingJoiningDate !== formJoiningDate;

//       const updateEmployeeData = async (joiningDate, newEmpId = existingEmpId) => {
//         const updatedFormData = {
//           ...formData,
//           work_details: {
//             ...formData.work_details,
//             previousDateOfJoining: existingJoiningDate,
//             dateOfJoining: dayjs(joiningDate).format('YYYY-MM-DD'),
//             employmentStatus: 'Active',
//             empId: newEmpId,
//           },
//         };

//         try {
//           const editResponse = await api.patch(`/api/employee/${formData.work_details.wdId}/`, updatedFormData);
//           if (editResponse.status === 200) {
//             message.success('Employee details updated successfully.');
//             navigate('/employeelist');
//           }
//         } catch (error) {
//           console.error('Error updating employee details:', error);
//           message.error('Failed to update employee details.');
//         }
//       };

//       if (isEmpIdChanged && isJoiningDateChanged) {
//         Modal.confirm({
//           title: 'Do you wish to change the following data?',
//           content: (
//             <div>
//               <p><strong>EmpId: </strong>{existingEmpId} → {formEmpId}</p>
//               <p><strong>Joining Date: </strong>{dayjs(existingJoiningDate).format('YYYY-MM-DD')} → {dayjs(formJoiningDate).format('YYYY-MM-DD')}</p>
//             </div>
//           ),
//           okText: 'Yes, update',
//           cancelText: 'No, cancel',
//           onOk: () => updateEmployeeData(formJoiningDate, formEmpId),
//           onCancel: () => message.info('Action canceled.'),
//         });
//       } else if (isEmpIdChanged) {
//         Modal.confirm({
//           title: 'EmpId has changed. Do you wish to update?',
//           content: (
//             <div>
//               <p><strong>EmpId: </strong>{existingEmpId} → {formEmpId}</p>
//               <p><strong>Current Joining Date: </strong>{dayjs(existingJoiningDate).format('YYYY-MM-DD')}</p>
//             </div>
//           ),
//           okText: 'Yes, update',
//           cancelText: 'No, cancel',
//           onOk: () => updateEmployeeData(existingJoiningDate, formEmpId),
//           onCancel: () => message.info('Action canceled.'),
//         });
//       } else if (isJoiningDateChanged) {
//         Modal.confirm({
//           title: 'Joining Date has changed. Do you wish to update?',
//           content: (
//             <div>
//               <p><strong>Joining Date: </strong>{dayjs(existingJoiningDate).format('YYYY-MM-DD')} → {dayjs(formJoiningDate).format('YYYY-MM-DD')}</p>
//               <p><strong>Current EmpId: </strong>{existingEmpId}</p>
//             </div>
//           ),
//           okText: 'Yes, update',
//           cancelText: 'No, cancel',
//           onOk: () => updateEmployeeData(formJoiningDate),
//           onCancel: () => message.info('Action canceled.'),
//         });
//       } else {
//         message.info('No changes detected. Action canceled.');
//       }
//     } else {
//       message.error('No work details found for the given ID.');
//     }
//   } catch (error) {
//     console.error('Error checking Employee ID:', error);
//     message.error('Failed to check Employee ID.');
//   }
// };


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
  
        // Date of Joining: Check if filled
        // if (!formData.work_details.dateOfJoining) stepErrors.dateOfJoining = 'Date of Joining is required';
        
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
      

      case 4: // Salary Details validation
        // Validate CTCpayAMT (Gross Pay)
        if (!formData.salary_details.CTCpayAMT || isNaN(formData.salary_details.CTCpayAMT)) {
          stepErrors.CTCpayAMT = 'Gross Pay must be a valid number';
        }

        // Validate BasicpayAMT
        if (!formData.salary_details.BasicpayAMT || isNaN(formData.salary_details.BasicpayAMT)) {
          stepErrors.BasicpayAMT = 'Basic Pay must be a valid number';
        }

        // Validate HRApayAMT
        if (!formData.salary_details.HRApayAMT || isNaN(formData.salary_details.HRApayAMT)) {
          stepErrors.HRApayAMT = 'HRA Pay must be a valid number';
        }

        break;

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
    // const company_id = localStorage.getItem('companyId');
    const userId = await fetchUserId();
    if (!userId) {
      setErrors('User ID not found');
      return;
    }

    const company_id = await fetchCompanyId(userId);
    if (!company_id) {
      setErrors('Company ID not found');
      return;
    }
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

        case 4: // Salary Details Form
        return (
          <div className="employee-setup-form">
            <SalaryDetailsForm 
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
  
          {/* {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleSubmit} className="submit-button">
                {isEditMode ? 'Update' : 'Submit'}            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button> */}

             {/* {activeStep === steps.length - 1 ? (
    <Button variant="contained" onClick={handleSubmit} className="submit-button">
      {rehireMode ? 'Rehire' : isEditMode ? 'Update' : 'Submit'}
    </Button>
  ) : (
    <Button variant="contained" onClick={handleNext}>
      Next
    </Button>  */}
    
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


  // return (
  //   <div>
  //     <Navbar />
  //     <Box className="employee-setup-container">
  //       <Stepper activeStep={activeStep} alternativeLabel className="employee-setup-stepper">
  //         {steps.map((label) => (
  //           <Step key={label}>
  //             <StepLabel>{label}</StepLabel>
  //           </Step>
  //         ))}
  //       </Stepper>

  //       <Box sx={{ mt: 2, mb: 2 }}>
  //         {isDataLoaded && renderFormFields(activeStep)}
  //       </Box>

  //       <Box className="employee-setup-button-container">
  //         {activeStep !== 0 && (
  //           <Button onClick={handleBack} className="back-button">
  //             Back
  //           </Button>
  //         )}

  //         {rehireMode && (
  //           <Button variant="contained" onClick={handleSubmit} className="submit-button">
  //             Submit as Rehire
  //           </Button>
  //         )}

  //         {!rehireMode && activeStep === steps.length - 1 ? (
  //           <Button variant="contained" onClick={handleSubmit} className="submit-button">
  //             {isEditMode ? 'Update' : 'Submit'}
  //           </Button>
  //         ) : (
  //           <Button variant="contained" onClick={handleNext}>
  //             Next
  //           </Button>
  //         )}

  //         {employeeData && !rehireMode && (
  //           <Button variant="outlined" onClick={handleRehire} style={{ marginLeft: '1rem' }}>
  //             Rehire
  //           </Button>
  //         )}
  //       </Box>
  //     </Box>
  //   </div>
  // );
  
}

export default EmployeeSetup2;
