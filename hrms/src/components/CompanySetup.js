import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; 
import './CompanySetup.css'; 
import { useNavigate } from 'react-router-dom';


const CompanySetup = () => {
  const [step, setStep] = useState(1);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormValues({ ...formValues, [name]: files[0] });  
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // new roles
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();

  //   formData.append('companyName', formValues.companyName);
  //   formData.append('companyRegisteredId', formValues.companyRegisteredId);
  //   formData.append('address', formValues.address);
  //   formData.append('adminEmail', formValues.adminEmail);
  //   formData.append('adminName', formValues.adminName);
  //   formData.append('adminPhoneNum', formValues.adminPhoneNum);
  //   formData.append('gst', formValues.gst);
  //   formData.append('pan', formValues.pan);
  //   formData.append('tan', formValues.tan);

   
  //   if (formValues.coi) formData.append('coi', formValues.coi);
  //   if (formValues.logo) formData.append('logo', formValues.logo);
  //   if (formValues.leavePolicy) formData.append('leavePolicy', formValues.leavePolicy);
  //   if (formValues.pfPolicy) formData.append('pfPolicy', formValues.pfPolicy);
  //   if (formValues.labourLawLicence) formData.append('labourLawLicence', formValues.labourLawLicence);

  //   try {
  //     const response = await axios.post('http://localhost:8000/api/companydetails/', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     if (response.status === 201) {
  //       setMessage('Successfully submitted');
  //       const companyId = response.data.companyId;
  //       // Check if companyId is defined
  //       if (companyId) {
  //         // Save the companyId to local storage
  //         localStorage.setItem('companyId', companyId);
  //         console.log("Company Id", companyId);
  //         // Update completion status
  //         await updateCompletionStatus(companyId);
  //         navigate('/payrolesetup'); 
          
  //       } else {
  //         console.error('Company Id is undefined in the response');
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form', error.response.data);
  //   }
  // };

  // const updateCompletionStatus = async (companyId) => {
  //   try {
  //     await axios.patch(`http://localhost:8000/api/company/${companyId}/`, {
  //       is_company_details_completed: true,
  //       is_payroll_setup_completed: false, // Adjust based on your application flow
  //     });
  //   } catch (error) {
  //     console.error('Error updating completion status', error);
  //   }
  // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     formData.append('companyName', formValues.companyName);
//     formData.append('companyRegisteredId', formValues.companyRegisteredId);
//     formData.append('address', formValues.address);
//     formData.append('adminEmail', formValues.adminEmail);
//     formData.append('adminName', formValues.adminName);
//     formData.append('adminPhoneNum', formValues.adminPhoneNum);
//     formData.append('gst', formValues.gst);
//     formData.append('pan', formValues.pan);
//     formData.append('tan', formValues.tan);

//     // Append optional files
//     if (formValues.logo) formData.append('logo', formValues.logo);
//     if (formValues.leavePolicy) formData.append('leavePolicy', formValues.leavePolicy);
//     if (formValues.pfPolicy) formData.append('pfPolicy', formValues.pfPolicy);
//     if (formValues.labourLawLicence) formData.append('labourLawLicence', formValues.labourLawLicence);

//     try {
//         const response = await axios.post('http://localhost:8000/api/companydetails/', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//             },
//         });

//         if (response.status === 201) {
//             setMessage('Successfully submitted');
//             const companyId = response.data.companyId;
//             if (companyId) {
//                 localStorage.setItem('companyId', companyId);
//                 console.log("Company Id", companyId);
//                 await updateCompletionStatus(companyId);
//                 navigate('/payrolesetup');
//             } else {
//                 console.error('Company Id is undefined in the response');
//             }
//         }
//     } catch (error) {
//         console.error('Error submitting form', error.response.data);
//     }
// };

// const updateCompletionStatus = async () => {
//   const userId = localStorage.getItem('userId');  // Retrieve the user ID
//   const companyId = localStorage.getItem('companyId');
//   try {
//       await axios.patch(`http://localhost:8000/api/company-status/${userId}/`, {
//           is_company_setup_complete: true,
//           role: 'admin',
//           company_id: companyId,
//       }, {
//           headers: {
//               'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//           },
//       });
//   } catch (error) {
//       console.error('Error updating completion status', error);
//   }
// };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('companyName', formValues.companyName);
    formData.append('companyRegisteredId', formValues.companyRegisteredId);
    formData.append('address', formValues.address);
    formData.append('adminEmail', formValues.adminEmail);
    formData.append('adminName', formValues.adminName);
    formData.append('adminPhoneNum', formValues.adminPhoneNum);
    formData.append('gst', formValues.gst);
    formData.append('pan', formValues.pan);
    formData.append('tan', formValues.tan);

    // Append optional files
    if (formValues.logo) formData.append('logo', formValues.logo);
    if (formValues.leavePolicy) formData.append('leavePolicy', formValues.leavePolicy);
    if (formValues.pfPolicy) formData.append('pfPolicy', formValues.pfPolicy);
    if (formValues.labourLawLicence) formData.append('labourLawLicence', formValues.labourLawLicence);

    // Retrieve the user_id from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('No user ID found in localStorage');
        return;
    }
    formData.append('user_id', userId);  // Add user_id to form data
    try {
        const response = await axios.post('http://localhost:8000/api/companydetails/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('refresh')}`,
                
            },
        });
        
        if (response.status === 201) {
            setMessage('Successfully submitted');
            const companyId = response.data.companyId;

            if (companyId) {
                // Save the companyId to localStorage and log it for debugging
                localStorage.setItem('companyId', companyId);
                console.log("Company Id:", companyId);

                // Call function to update completion status
                await updateCompletionStatus(companyId);
                navigate('/payrolesetup');
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
  
    try {
        await axios.patch(`http://localhost:8000/api/company-status/${userId}/`, {
            company_id: companyId,  // Ensure this is sent
            is_company_setup_complete: true,
            role: "admin",
            is_admin: true
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
    } catch (error) {
        console.error('Error updating completion status', error);
    }
  };




  return (
    <div>
      <Navbar />  {/* Add Navbar here */}
      <h2>Company Setup</h2>
    <div className="company-setup-container">

      
      {step === 1 && (
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
          </div>
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="company-form-container">
          <h3>Company Info</h3>
          {/* <div className="form-row"> */}

          <div className="form-group">

            <label>Company Name:</label>
            <input
              type="text"
              name="companyName"
              value={formValues.companyName}
              onChange={handleChange}
              required
            />
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
          </div>
          {/* </div> */}
          {/* <div className="form-row"> */}

          <div className="form-group">
            <label>PAN:</label>
            <input
              type="text"
              name="pan"
              value={formValues.pan}
              onChange={handleChange}
              required
            />
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
          </div>
          <div className="form-group">
            <label>GST:</label>
            <input
              type="text"
              name="gst"
              value={formValues.gst}
              onChange={handleChange}
              required
            />
          </div>
          {/* </div> */}
          {/* <div className="form-row"> */}

          <div className="form-group">
            <label>Company Address:</label>
            <textarea
              name="address"
              value={formValues.address}
              onChange={handleChange}
              required
            />
          </div>
          {/* </div> */}
          {/* <div className="form-row"> */}

          <div className="form-group">
            <label>COI:</label>
            <input
              type="file"
              name="coi"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group">
            <label>Logo:</label>
            <input
              type="file"
              name="logo"
              onChange={handleFileChange}
            />
          </div>
          {/* </div> */}
          <button onClick={handlePrevStep}>Back</button>
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div className="company-form-container">
          <h3>Organizational Rules</h3>
          <div className="form-group">
            <label>Leave Policy:</label>
            <input
              type="file"
              name="leavePolicy"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="form-group">
            <label>PF Policy:</label>
            <input
              type="file"
              name="pfPolicy"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Labour Law Licence:</label>
            <input
              type="file"
              name="labourLawLicence"
              onChange={handleFileChange}
              required
            />
          </div>
          <button onClick={handlePrevStep}>Back</button>

          <button onClick={handleSubmit}>Submit</button>
          {message && <p>{message}</p>}
        </div>
      )}
       
    </div>
    </div>
  );
};

export default CompanySetup;
