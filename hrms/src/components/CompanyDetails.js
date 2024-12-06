import React, { useEffect, useState } from 'react';
import Navbar from '../pages/Navbar';
import { FaEdit } from 'react-icons/fa'; 
import '../styles/CompanyDetails.css';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { fetchUserId, fetchCompanyId } from '../helpers/CompanyId';

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

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {

    const getCompanyDetails = async () => {
      try {
        const userId = await fetchUserId(); // Fetch userId using helper function
        console.log("UID:",userId)
        if (!userId) {
          setError('User ID not found');
          return;
        }

        // const role = await fetchRole(); // Fetch userId using helper function
        // console.log("Role:",role)
        // if (!role) {
        //   setError('Role not found');
        //   return;
        // }

        const companyId = await fetchCompanyId(userId); // Fetch companyId using helper function
        console.log("UUUID:",userId)

        console.log("COMID:",companyId)
        if (!companyId) {
          setError('Company ID not found');
          return;
        }


    // const companyId = localStorage.getItem('companyId');
    // if (!companyId) {
    //   setError('Company ID not found');
    //   return;
    // }
    const url = `/api/companydetails/retrieve/${companyId}/`; 
    // api.get(url)
    const response = await api.get(url);

  
      // .then(response => {
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
      // })
      // .catch(error => {
      } catch (error) {

        console.error('Error fetching company details:', error);
        setError('Failed to load company details');
      // });
  // }, [navigate]);
}
};
getCompanyDetails();
}, [navigate]);

  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleCancel = () => {
    setEditableCompany(company); // Revert to original data
    setIsEditing(false); // Exit editing mode
    setFiles({
      logo: null,
      coi: null,
      leave_policy: null,
      pf_policy: null,
      labour_law_licence: null,
    });
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
    
  //   const url1 = `/api/companydetails/update/${companyId}/`; 

  //   api.put(url1, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   })
   
  //     .then(response => {
  //       setCompany({
  //         ...response.data,
  //       });
  //       setEditableCompany(response.data);
  //       setIsEditing(false);
  //       setFiles({
  //         logo: null,
  //         coi: null,
  //         leave_policy: null,
  //         pf_policy: null,
  //         labour_law_licence: null,
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Error updating company details:', error);
  //       setError('Failed to update company details');
  //     });
  // };

  const handleSave = async () => {
    try {
      // Get the userId and companyId dynamically using the helper functions
      const userId = await fetchUserId();
      if (!userId) {
        setError('User ID not found');
        return;
      }

      // const role = await fetchRole(); // Fetch userId using helper function
      // console.log("Role:",role)
      // if (!role) {
      //   setError('Role not found');
      //   return;
      // }

      // const companyId = await fetchCompanyId(userId, role); 
  
      const companyId = await fetchCompanyId(userId);
      if (!companyId) {
        setError('Company ID not found');
        return;
      }
  
      // Prepare form data for the request
      const formData = new FormData();
    
      // Append non-file data
      for (const key in editableCompany) {
        formData.append(key, editableCompany[key]);
      }
    
      // Append file data if files exist
      if (files.logo) formData.append('logo', files.logo);
      if (files.coi) formData.append('coi', files.coi);
      if (files.leave_policy) formData.append('leave_policy', files.leave_policy);
      if (files.pf_policy) formData.append('pf_policy', files.pf_policy);
      if (files.labour_law_licence) formData.append('labour_law_licence', files.labour_law_licence);
      
      // Use the companyId in the URL
      const url1 = `/api/companydetails/update/${companyId}/`;
  
      // Make the API request to save the updated company details
      const response = await api.put(url1, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
     
      // Update the company details on success
      setCompany({
        ...response.data,
      });
      setEditableCompany(response.data);
      setIsEditing(false);
  
      // Reset files after save
      setFiles({
        logo: null,
        coi: null,
        leave_policy: null,
        pf_policy: null,
        labour_law_licence: null,
      });
    } catch (error) {
      console.error('Error updating company details:', error);
      setError('Failed to update company details');
    }
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

            {/* Conditional rendering of Save button */}
            {isEditing && (
               <div className="button-container">
                <button onClick={handleSave} className="save-button">Save</button>
                <button onClick={handleCancel} className="cancel-button">Cancel</button>
              </div>            
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


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from './Navbar';
// import { FaEdit } from 'react-icons/fa'; 
// import './CompanyDetails.css'; 
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode'; // Import the jwtDecode function

// const CompanyDetails = () => {
//   const [company, setCompany] = useState(null);
//   const [editableCompany, setEditableCompany] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState(null);
//   const [files, setFiles] = useState({
//     logo: null,
//     coi: null,
//     leave_policy: null,
//     pf_policy: null,
//     labour_law_licence: null,
//   });

//   const navigate = useNavigate(); // Hook for navigation

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       const token = localStorage.getItem('access');
//       const refreshToken = localStorage.getItem('refresh'); // Get the refresh token

//       if (!token) {
//         console.log('No access token found');
//         navigate('/login'); // Redirect to login if no token
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000; // Get current time in seconds

//         if (decodedToken.exp < currentTime) {
//           console.log('Access token expired');
//           if (refreshToken) {
//             // Try refreshing the token if the access token is expired
//             try {
//               const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
//               const { access } = response.data;
//               localStorage.setItem('access', access); // Store the new access token
//               console.log('Access token refreshed');
//             } catch (error) {
//               console.error('Refresh token failed', error);
//               localStorage.clear(); // Clear localStorage if refresh fails
//               navigate('/login'); // Redirect to login
//             }
//           } else {
//             console.log('No refresh token found');
//             localStorage.clear();
//             navigate('/login');
//           }
//         }
//       } catch (error) {
//         console.error('Invalid access token', error);
//         localStorage.clear(); // Clear localStorage if the token is invalid
//         navigate('/login'); // Redirect to login
//       }
//     };

//     checkAuthentication(); // Check for authentication

//     const companyId = localStorage.getItem('companyId');
//     if (!companyId) {
//       setError('Company ID not found');
//       return;
//     }

//     axios
//       .get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('access')}`
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
//   }, [navigate]);

//   const handleEdit = () => {
//     setIsEditing(true); // Enable editing mode
//   };

//   const handleCancel = () => {
//     setEditableCompany(company); // Revert to original data
//     setIsEditing(false); // Exit editing mode
//     setFiles({
//       logo: null,
//       coi: null,
//       leave_policy: null,
//       pf_policy: null,
//       labour_law_licence: null,
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditableCompany((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files.length > 0) {
//       setFiles((prev) => ({
//         ...prev,
//         [name]: files[0], // Save the selected file
//       }));
//     }
//   };

//   const handleSave = () => {
//     const companyId = localStorage.getItem('companyId');
//     const formData = new FormData();
  
//     // Append non-file data
//     for (const key in editableCompany) {
//       formData.append(key, editableCompany[key]);
//     }
  
//     // Append file data
//     if (files.logo) formData.append('logo', files.logo);
//     if (files.coi) formData.append('coi', files.coi);
//     if (files.leave_policy) formData.append('leave_policy', files.leave_policy);
//     if (files.pf_policy) formData.append('pf_policy', files.pf_policy);
//     if (files.labour_law_licence) formData.append('labour_law_licence', files.labour_law_licence);
  
//     axios
//       .put(`http://localhost:8000/api/companydetails/update/${companyId}/`, formData, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('access')}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       })
//       .then(response => {
//         setCompany({
//           ...response.data,
//         });
//         setEditableCompany(response.data);
//         setIsEditing(false);
//         setFiles({
//           logo: null,
//           coi: null,
//           leave_policy: null,
//           pf_policy: null,
//           labour_law_licence: null,
//         });
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
//         <div className="field-container" key={key}>
//           <span className="field-label">{key.replace(/_/g, ' ').toUpperCase()}:</span>
//           {isEditing ? (
//             <>
//               {/* Check if the field is a file field and render file input accordingly */}
//               {['logo_url', 'coi_url', 'leave_policy_url', 'pf_policy_url', 'labour_law_licence_url'].includes(key) ? (
//                 <input
//                   type="file"
//                   name={key.replace('_url', '')} // Set file input name without '_url'
//                   onChange={handleFileChange}
//                   className="input-file"
//                 />
//               ) : (
//                 // Render text input for non-file fields
//                 <input
//                   type="text"
//                   name={key}
//                   value={editableCompany[key] || ''}
//                   onChange={handleChange}
//                   className="input-field"
//                 />
//               )}
//             </>
//           ) : (
//             // Display values when not editing
//             <span className="field-value">
//               {/* Check if it's a file URL and render as a link */}
//               {['logo_url', 'coi_url', 'leave_policy_url', 'pf_policy_url', 'labour_law_licence_url'].includes(key) && company[key] ? (
//                 <a href={company[key]} target="_blank" rel="noopener noreferrer">View Document</a>
//               ) : (
//                 company[key]
//               )}
//             </span>
//           )}
//         </div>
// ))}

//             {/* Conditional rendering of Save button */}
//             {isEditing && (
//                <div className="button-container">
//                 <button onClick={handleSave} className="save-button">Save</button>
//                 <button onClick={handleCancel} className="cancel-button">Cancel</button>
//               </div>            
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

//get companydetails using user id
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from './Navbar';
// import { FaEdit } from 'react-icons/fa'; 
// import './CompanyDetails.css'; 
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode'; // Correct import

// const CompanyDetails = () => {
//   const [company, setCompany] = useState(null);
//   const [editableCompany, setEditableCompany] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState(null);
//   const [files, setFiles] = useState({
//     logo: null,
//     coi: null,
//     leave_policy: null,
//     pf_policy: null,
//     labour_law_licence: null,
//   });

//   const navigate = useNavigate(); // Hook for navigation

//   useEffect(() => {
//     const checkAuthentication = () => {
//       const token = localStorage.getItem('access');
//       if (!token) {
//         console.log('No token found');
//         navigate('/login');
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000; // Get current time in seconds
//         if (decodedToken.exp < currentTime) {
//           console.log('Token expired');
//           localStorage.clear();
//           navigate('/login');
//           return;
//         }

//         // Extract userId from the token
//         const userId = decodedToken.user_id; // Ensure this matches the key in your token
//         if (!userId) {
//           setError('User ID not found');
//           return;
//         }

//         // Call the API with the userId
//         axios.get(`http://localhost:8000/api/getcompanydetails/`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('access')}`
//           },
//           params: {
//             userId // Pass userId as a query parameter if needed
//           }
//         })
//         .then(response => {
//           const updatedData = {
//             ...response.data,
//             logo_url: response.data.logo_url ? `http://localhost:8000${response.data.logo_url}` : null,
//             coi_url: response.data.coi_url ? `http://localhost:8000${response.data.coi_url}` : null,
//             leave_policy_url: response.data.leave_policy_url ? `http://localhost:8000${response.data.leave_policy_url}` : null,
//             pf_policy_url: response.data.pf_policy_url ? `http://localhost:8000${response.data.pf_policy_url}` : null,
//             labour_law_licence_url: response.data.labour_law_licence_url ? `http://localhost:8000${response.data.labour_law_licence_url}` : null,
//           };
//           setCompany(updatedData);
//           setEditableCompany(updatedData);
//         })
//         .catch(error => {
//           console.error('Error fetching company details:', error);
//           setError('Failed to load company details');
//         });
//       } catch (error) {
//         console.error('Invalid token', error);
//         localStorage.clear();
//         navigate('/login');
//       }
//     };

//     checkAuthentication(); // Run the authentication and company check

//   }, [navigate]);

//   // Rest of the code remains the same...
//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setEditableCompany(company);
//     setIsEditing(false);
//     setFiles({
//       logo: null,
//       coi: null,
//       leave_policy: null,
//       pf_policy: null,
//       labour_law_licence: null,
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditableCompany((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files.length > 0) {
//       setFiles((prev) => ({
//         ...prev,
//         [name]: files[0],
//       }));
//     }
//   };

//   const handleSave = () => {
//     const formData = new FormData();

//     for (const key in editableCompany) {
//       formData.append(key, editableCompany[key]);
//     }

//     if (files.logo) formData.append('logo', files.logo);
//     if (files.coi) formData.append('coi', files.coi);
//     if (files.leave_policy) formData.append('leave_policy', files.leave_policy);
//     if (files.pf_policy) formData.append('pf_policy', files.pf_policy);
//     if (files.labour_law_licence) formData.append('labour_law_licence', files.labour_law_licence);

//     axios.put(`http://localhost:8000/api/companydetails/update/${editableCompany.id}/`, formData, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('access')}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//     .then(response => {
//       setCompany(response.data);
//       setEditableCompany(response.data);
//       setIsEditing(false);
//       setFiles({
//         logo: null,
//         coi: null,
//         leave_policy: null,
//         pf_policy: null,
//         labour_law_licence: null,
//       });
//     })
//     .catch(error => {
//       console.error('Error updating company details:', error);
//       setError('Failed to update company details');
//     });
//   };

//   if (error) return <p>{error}</p>;

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
//             {Object.keys(company).map((key) => (
//               <div className="field-container" key={key}>
//                 <span className="field-label">{key.replace(/_/g, ' ').toUpperCase()}:</span>
//                 {isEditing ? (
//                   ['logo_url', 'coi_url', 'leave_policy_url', 'pf_policy_url', 'labour_law_licence_url'].includes(key) ? (
//                     <input
//                       type="file"
//                       name={key.replace('_url', '')}
//                       onChange={handleFileChange}
//                       className="input-file"
//                     />
//                   ) : (
//                     <input
//                       type="text"
//                       name={key}
//                       value={editableCompany[key] || ''}
//                       onChange={handleChange}
//                       className="input-field"
//                     />
//                   )
//                 ) : (
//                   <span className="field-value">
//                     {['logo_url', 'coi_url', 'leave_policy_url', 'pf_policy_url', 'labour_law_licence_url'].includes(key) && company[key] ? (
//                       <a href={company[key]} target="_blank" rel="noopener noreferrer">View Document</a>
//                     ) : (
//                       company[key]
//                     )}
//                   </span>
//                 )}
//               </div>
//             ))}
//             {isEditing && (
//               <div className="button-container">
//                 <button onClick={handleSave} className="save-button">Save</button>
//                 <button onClick={handleCancel} className="cancel-button">Cancel</button>
//               </div>
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
