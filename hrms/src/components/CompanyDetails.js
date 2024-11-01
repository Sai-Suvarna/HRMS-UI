// // CompanyDetails.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from './Navbar';
// import { FaEdit } from 'react-icons/fa'; 
// import './CompanyDetails.css'; 
// import { useNavigate } from 'react-router-dom'; 

// const CompanyDetails = () => {
//   const [company, setCompany] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch the companyId from localStorage
//     const companyId = localStorage.getItem('companyId');

//     if (!companyId) {
//       setError('Company ID not found');
//       return;
//     }

//     // Fetch company details from the API
//     axios
//       .get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         }
//       })
//       // .then(response => {
//       //   setCompany(response.data);
//       // })
//       .then(response => {
//         // Ensure all URLs are fully qualified
//         const updatedData = {
//           ...response.data,
//           logo_url: response.data.logo_url ? `http://localhost:8000${response.data.logo_url}` : null,
//           coi_url: response.data.coi_url ? `http://localhost:8000${response.data.coi_url}` : null,
//           leave_policy_url: response.data.leave_policy_url ? `http://localhost:8000${response.data.leave_policy_url}` : null,
//           pf_policy_url: response.data.pf_policy_url ? `http://localhost:8000${response.data.pf_policy_url}` : null,
//           labour_law_licence_url: response.data.labour_law_licence_url ? `http://localhost:8000${response.data.labour_law_licence_url}` : null,
//         };
//         setCompany(updatedData);
//       })
//       .catch(error => {
//         console.error('Error fetching company details:', error);
//         setError('Failed to load company details');
//       });
//   }, []);

//   const navigate = useNavigate(); // Create navigate object for navigation


//   const handleEdit = () => {
//     // Redirect to edit page or open a modal for editing
//     console.log("Edit company details");

//   };

//   if (error) return <p>{error}</p>;
//   console.log('Company data:', company); 


//   return (
//     // <Home>
//     <div>
//       <Navbar />
//       <div className="companydetails-container">
//       <h2 style={{ alignItems: 'center' }}>
//           Company Details
//           <FaEdit className="edit-icon" onClick={handleEdit} />
//         </h2>        
//         {company ? (
//           <div className="company-details">
//             <div className="field-container">
//               <span className="field-label">Admin Name:</span>
//               <span className="field-value">{company.adminName}</span>
//             </div>
//             <div className="field-container">
//               <span className="field-label">Admin Email:</span>
//               <span className="field-value">{company.adminEmail}</span>
//             </div>
//             <div className="field-container">
//               <span className="field-label">Admin Phone Number:</span>
//               <span className="field-value">{company.adminPhoneNum}</span>
//             </div>
//             <div className="field-container">
//               <span className="field-label">Company Name:</span>
//               <span className="field-value">{company.companyName}</span>
//             </div>
//             <div className="field-container">
//               <span className="field-label">Company Registered ID:</span>
//               <span className="field-value">{company.companyRegisteredId}</span>
//             </div>
//             <div className="field-container">
//               <span className="field-label">PAN:</span>
//               <span className="field-value">{company.pan}</span>
//             </div>
//             <div className="field-container">
//               <span className="field-label">TAN:</span>
//               <span className="field-value">{company.tan}</span>
//             </div>
//             <div className="field-container">
//               <span className="field-label">GST:</span>
//               <span className="field-value">{company.gst}</span>
//             </div>
//             <div className="field-container">
//             <span className="field-label">LOGO:</span>
//             {company.logo_url ? (
//                 <a href={company.logo_url} target="_blank" rel="noopener noreferrer"> View LOGO</a>
//               ) : (
//                 <span className="field-value">No LOGO available</span>
//               )}
              
//             </div>
//             <div className="field-container">
//             <span className="field-label">COI:</span>
//             {company.coi_url ? (
//                 <a href={company.coi_url} target="_blank" rel="noopener noreferrer">View COI</a>
//               ) : (
//                 <span className="field-value">No COI available</span>
//               )}
             
//             </div>
//             <div className="field-container">
//               <span className="field-label">Address:</span>
//               <span className="field-value">{company.address}</span>
//             </div>
//             <div className="field-container">
//             <span className="field-label">Leave Policy:</span>
//             {company.leave_policy_url ? (
//                 <a href={company.leave_policy_url} target="_blank" rel="noopener noreferrer">View Leave Policy</a>
//               ) : (
//                 <span className="field-value">No leave policy available</span>
//               )}
           
//             </div>
//             <div className="field-container">
//             <span className="field-label">PF Policy:</span>
//             {company.pf_policy_url ? (
//                 <a href={company.pf_policy_url} target="_blank" rel="noopener noreferrer">View PF Policy</a>
//               ) : (
//                 <span className="field-value">No PF policy available</span>
//               )}
              
//             </div>
//             <div className="field-container">
//             <span className="field-label">Labour Law Licence:</span>
//             {company.labour_law_licence_url ? (
//                 <a href={company.labour_law_licence_url} target="_blank" rel="noopener noreferrer">View Labour Law Licence</a>
//               ) : (
//                 <span className="field-value">No labour law licence available</span>
//               )}
              
//             </div>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//     </div>
    
//   );
// };

// export default CompanyDetails;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from './Navbar';
// import { FaEdit } from 'react-icons/fa'; 
// import './CompanyDetails.css'; 
// import { useNavigate } from 'react-router-dom'; 

// const CompanyDetails = () => {
//   const [company, setCompany] = useState(null);
//   const [editableCompany, setEditableCompany] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const companyId = localStorage.getItem('companyId');

//     if (!companyId) {
//       setError('Company ID not found');
//       return;
//     }

//     axios
//       .get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         }
//       })
//       .then(response => {
//         const updatedData = {
//           ...response.data,
//           logo_url: response.data.logo_url ? `http://localhost:8000${response.data.logo_url}` : null,
//           coi_url: response.data.coi_url ? `http://localhost:8000${response.data.coi_url}` : null,
//           leave_policy_url: response.data.leave_policy_url ? `http://localhost:8000${response.data.leave_policy_url}` : null,
//           pf_policy_url: response.data.pf_policy_url ? `http://localhost:8000${response.data.pf_policy_url}` : null,
//           labour_law_licence_url: response.data.labour_law_licence_url ? `http://localhost:8000${response.data.labour_law_licence_url}` : null,
//         };
//         setCompany(updatedData);
//         setEditableCompany(updatedData);
//       })
//       .catch(error => {
//         console.error('Error fetching company details:', error);
//         setError('Failed to load company details');
//       });
//   }, []);

//   const navigate = useNavigate(); 

//   const handleEdit = () => {
//     setIsEditing(true); // Enable editing mode
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditableCompany((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSave = () => {
//     const companyId = localStorage.getItem('companyId');
    
//     axios
//       .put(`http://localhost:8000/api/companydetails/update/${companyId}/`, editableCompany, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//           'Content-Type': 'application/json',
//         },
//       })
//       .then(response => {
//         // Update the company state with the new data
//         setCompany({
//           ...response.data,
//           // logo_url: response.data.logo_url ? `http://localhost:8000${response.data.logo_url}` : null,
//           // coi_url: response.data.coi_url ? `http://localhost:8000${response.data.coi_url}` : null,
//           // leave_policy_url: response.data.leave_policy_url ? `http://localhost:8000${response.data.leave_policy_url}` : null,
//           // pf_policy_url: response.data.pf_policy_url ? `http://localhost:8000${response.data.pf_policy_url}` : null,
//           // labour_law_licence_url: response.data.labour_law_licence_url ? `http://localhost:8000${response.data.labour_law_licence_url}` : null,
//         });
//         setEditableCompany(response.data); // Update editableCompany to the new values
//         setIsEditing(false); // Disable editing mode
//       })
//       .catch(error => {
//         console.error('Error updating company details:', error);
//         setError('Failed to update company details');
//       });
//   };

//   if (error) return <p>{error}</p>;
//   console.log('Company data:', company); 

//   return (
//     <div>
//       <Navbar />
//       <div className="companydetails-container">
//         <h2 style={{ alignItems: 'center' }}>
//           Company Details
//           <FaEdit className="edit-icon" onClick={handleEdit} />
//         </h2>        
//         {company ? (
//           <div className="company-details">
//             {/* Loop through the fields */}
//             {Object.keys(company).map((key) => (
//               <div className="field-container" key={key}>
//                 <span className="field-label">{key.replace(/_/g, ' ').toUpperCase()}:</span>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name={key}
//                     value={editableCompany[key] || ''}
//                     onChange={handleChange}
//                     className="input-field"
//                     // style={{ width: '500px'  }} 

//                   />
//                 ) : (
//                   <span className="field-value">{company[key]}</span>
//                 )}
//               </div>
//             ))}

//             {/* Conditional rendering of Save button */}
//             {isEditing && (
//               <button onClick={handleSave}>Save</button>
//             )}
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompanyDetails;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { FaEdit } from 'react-icons/fa'; 
import './CompanyDetails.css'; 
import { useNavigate } from 'react-router-dom'; 

const CompanyDetails = () => {
  const [company, setCompany] = useState(null);
  const [editableCompany, setEditableCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({
    logo: null,
    coi: null,
    leave_policy: null,
    pf_policy: null,
    labour_law_licence: null,
  });

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');

    if (!companyId) {
      setError('Company ID not found');
      return;
    }

    axios
      .get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => {
        const updatedData = {
          ...response.data,
          logo_url: response.data.logo_url ? `http://localhost:8000${response.data.logo_url}` : null,
          coi_url: response.data.coi_url ? `http://localhost:8000${response.data.coi_url}` : null,
          leave_policy_url: response.data.leave_policy_url ? `http://localhost:8000${response.data.leave_policy_url}` : null,
          pf_policy_url: response.data.pf_policy_url ? `http://localhost:8000${response.data.pf_policy_url}` : null,
          labour_law_licence_url: response.data.labour_law_licence_url ? `http://localhost:8000${response.data.labour_law_licence_url}` : null,
        };
        setCompany(updatedData);
        setEditableCompany(updatedData);
      })
      .catch(error => {
        console.error('Error fetching company details:', error);
        setError('Failed to load company details');
      });
  }, []);


  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFiles((prev) => ({
        ...prev,
        [name]: files[0], // Save the selected file
      }));
    }
  };

  // const handleSave = () => {
  //   const companyId = localStorage.getItem('companyId');
  //   const formData = new FormData();

  //   // Append non-file data
  //   for (const key in editableCompany) {
  //     formData.append(key, editableCompany[key]);
  //   }

  //   // Append file data
  //   if (files.logo) formData.append('logo', files.logo);
  //   if (files.coi) formData.append('coi', files.coi);
  //   if (files.leave_policy) formData.append('leave_policy', files.leave_policy);
  //   if (files.pf_policy) formData.append('pf_policy', files.pf_policy);
  //   if (files.labour_law_licence) formData.append('labour_law_licence', files.labour_law_licence);

  //   axios
  //     .put(`http://localhost:8000/api/companydetails/update/${companyId}/`, editableCompany, {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     .then(response => {
  //       // Update the company state with the new data
  //       setCompany({
  //         ...response.data,
  //       });
  //       setEditableCompany(response.data); // Update editableCompany to the new values
  //       setIsEditing(false); // Disable editing mode
  //       setFiles({
  //         logo: null,
  //         coi: null,
  //         leave_policy: null,
  //         pf_policy: null,
  //         labour_law_licence: null,
  //       }); // Reset file state
  //     })
  //     .catch(error => {
  //       console.error('Error updating company details:', error);
  //       setError('Failed to update company details');
  //     });
  // };


  const handleSave = () => {
    const companyId = localStorage.getItem('companyId');
    const formData = new FormData();
  
    // Append non-file data
    for (const key in editableCompany) {
      formData.append(key, editableCompany[key]);
    }
  
    // Append file data
    if (files.logo) formData.append('logo', files.logo);
    if (files.coi) formData.append('coi', files.coi);
    if (files.leave_policy) formData.append('leave_policy', files.leave_policy);
    if (files.pf_policy) formData.append('pf_policy', files.pf_policy);
    if (files.labour_law_licence) formData.append('labour_law_licence', files.labour_law_licence);
  
    axios
      .put(`http://localhost:8000/api/companydetails/update/${companyId}/`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        setCompany({
          ...response.data,
        });
        setEditableCompany(response.data);
        setIsEditing(false);
        setFiles({
          logo: null,
          coi: null,
          leave_policy: null,
          pf_policy: null,
          labour_law_licence: null,
        });
      })
      .catch(error => {
        console.error('Error updating company details:', error);
        setError('Failed to update company details');
      });
  };
  
  if (error) return <p>{error}</p>;
  console.log('Company data:', company); 

  return (
    <div>
      <Navbar />
      <div className="companydetails-container">
        <h2 style={{ alignItems: 'center' }}>
          Company Details
          <FaEdit className="edit-icon" onClick={handleEdit} />
        </h2>        
        {company ? (
          <div className="company-details">
            {/* Loop through the fields */}
            {Object.keys(company).map((key) => (
        <div className="field-container" key={key}>
          <span className="field-label">{key.replace(/_/g, ' ').toUpperCase()}:</span>
          {isEditing ? (
            <>
              {/* Check if the field is a file field and render file input accordingly */}
              {['logo_url', 'coi_url', 'leave_policy_url', 'pf_policy_url', 'labour_law_licence_url'].includes(key) ? (
                <input
                  type="file"
                  name={key.replace('_url', '')} // Set file input name without '_url'
                  onChange={handleFileChange}
                  className="input-file"
                />
              ) : (
                // Render text input for non-file fields
                <input
                  type="text"
                  name={key}
                  value={editableCompany[key] || ''}
                  onChange={handleChange}
                  className="input-field"
                />
              )}
            </>
          ) : (
            // Display values when not editing
            <span className="field-value">
              {/* Check if it's a file URL and render as a link */}
              {['logo_url', 'coi_url', 'leave_policy_url', 'pf_policy_url', 'labour_law_licence_url'].includes(key) && company[key] ? (
                <a href={company[key]} target="_blank" rel="noopener noreferrer">View Document</a>
              ) : (
                company[key]
              )}
            </span>
          )}
        </div>
))}

            {/* {Object.keys(company).map((key) => (
              <div className="field-container" key={key}>
                <span className="field-label">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                {isEditing ? (
                  <>
                  <input
                    type="text"
                    name={key}
                    value={editableCompany[key] || ''}
                    onChange={handleChange}
                    className="input-field"

                  />
                  {(key === 'logo' || key === 'coi' || key === 'leave_policy' || key === 'pf_policy' || key === 'labour_law_licence') && (
                      <input
                        type="file"
                        name={key}
                        onChange={handleFileChange}
                      />
                    )}
                  </>
                  
                ) : (
                  <span className="field-value">{company[key]}</span>
                )}
              </div>
            ))} */}

            {/* Conditional rendering of Save button */}
            {isEditing && (
              <button onClick={handleSave}>Save</button>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;




