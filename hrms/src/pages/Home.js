// working code with authentication and user role check

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from "../constants";
import { fetchUserId, fetchCompanyId } from '../helpers/CompanyId';

import Navbar from './Navbar';
import '../styles/Home.css';
import api from "../api";


const Home = () => {
  // const [companyExists, setCompanyExists] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [showSetupDropdown, setShowSetupDropdown] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.user_id;
          const roleName = decodedToken.role;
          console.log("RNMAE:",roleName)
          console.log("ID:",userId)
          setUserRole(roleName);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };
    fetchUserRole();
  }, [navigate]);
  
  const checkCompany = async () => {
    try {
      const userId = await fetchUserId();
      if (!userId) {
        setError('User ID not found');
        return;
      }
      console.log("SUV:",userId)
      const companyId = await fetchCompanyId(userId);
      if (!companyId) {
        setError('Company ID not found');
        return;
      }
      console.log("SS:",companyId)
      if (companyId) {
        const response = await api.get('/api/getcompanydetails/');
        // if (response.data) {
        //   // setCompanyExists(true);
        // }
        if (response.data) {
          navigate('/companydetails');
        } else {
          navigate('/companysetup');
        }
      }
    } catch (error) {
      console.error('Error checking company:', error);
    }
  };
  const handleCompanySetupClick = () => {
    checkCompany();
    // if (response.data) {
    //   navigate('/companydetails');
    // } else {
    //   navigate('/companysetup');
    // }
  };

  const handleSetupClick = () => {
    setShowSetupDropdown(!showSetupDropdown);
    setShowRegisterDropdown(false); // Close Register dropdown if open
  };

  const handleRegisterClick = () => {
    setShowRegisterDropdown(!showRegisterDropdown);
    setShowSetupDropdown(false); // Close Setup dropdown if open
  };

  const handleNavigate = (path) => {
    navigate(path);
    // setShowDropdown(false);
  };

  const renderLinks = () => {
    if (userRole === 'Super Admin') {
      return (
        <ul>
          <li><a href="/adminregister">Register Users</a></li>
        </ul>
      );
    }

    if (userRole === 'Admin' || userRole === 'Account Manager') {
      return (
        <ul>
          {/* <li><a href="/register">Register Users</a></li> */}
          <li className="dropdown">
            <a href="#" onClick={handleRegisterClick}>Register Users</a>
            {showRegisterDropdown && (
              <ul className="simple-dropdown">
                <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/adminregister')}>Admin/Account Manager</a></li>
                <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/employeeregister')}>Employees</a></li>
              </ul>
            )}
          </li>
          <li><a href="#" onClick={handleCompanySetupClick}>Company Setup</a></li>
          <li className="dropdown">
            <a href="#" onClick={handleSetupClick}>SetUp</a>
            {showSetupDropdown && (
              <ul className="simple-dropdown">
                <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/payroleset')}>Payroll Setup</a></li>
                <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/employeesetup')}>Employee Setup</a></li>
              </ul>
            )}
          </li>
          <li><a href="/employeelist">Employee List</a></li>
          <li><a href="/biometric">Biometric Attendance</a></li>
          <li><a href="/attendance">Attendance</a></li>
          <li><a href="/Validation">Pay Slip</a></li>
        </ul>
      );
    }

    if (userRole === 'employee') {
      return (
        <ul>
          <li><a href="/employeedetails">Profile</a></li>
        </ul>
      );
    }

    return null;
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="dashboard-box">
          {renderLinks()}
        </div>
        <div className="content-box">
          <h1>Welcome to the HRMS</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;








//working code with authentication without refreshtoken

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import Navbar from './Navbar';
// import '../styles/Home.css';
// import api from "../api";

// const Home = () => {
//   const [companyExists, setCompanyExists] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
//   const navigate = useNavigate(); // Create navigate object for navigation

//   useEffect(() => {
   
//     const checkCompany = async () => {
//       try {
//         const companyId = localStorage.getItem('companyId');
//         if (companyId) {
//           const response = await api.get('/api/getcompanydetails/');
//           // const response = await axios.get(`http://localhost:8000/api/getcompanydetails/`);
//           if (response.data) {
//             setCompanyExists(true);
//           }
//         }
//       } catch (error) {
//         console.error('Error checking company:', error);
//       }
//     };
//     checkCompany(); // Check for company setup

//   }, [navigate]);

//   const handleCompanySetupClick = () => {
//     if (companyExists) {
//       navigate('/companydetails');
//     } else {
//       navigate('/companysetup');
//     }
//   };

//   const handleSetupClick = () => {
//     setShowDropdown(!showDropdown); // Toggle dropdown visibility
//   };

//   const handleNavigate = (path) => {
//     navigate(path);
//     setShowDropdown(false); // Close dropdown after navigating
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="page-container">

//         <div className="dashboard-box">

//           <ul>
//           <li><a href="/register">Register Users</a></li>

//             <li><a href="#" onClick={handleCompanySetupClick}>Company Setup</a></li>
//             <li className="dropdown">
//               <a href="#" onClick={handleSetupClick}>SetUp</a>
//               {showDropdown && (
//                 <ul className="simple-dropdown">
//                   <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/payroleset')}>Payroll Setup</a></li>
//                   <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/employeesetup')}>Employee Setup</a></li>
//                 </ul>
//               )}
//             </li>
//             <li><a href="/employeelist">Employee List</a></li>
//             <li><a href="/biometric">Biometric Attendance</a></li>
//             {/* {role!='superadmin' && <li><a href="/employeelist">Employee List</a></li>}
//             {role!='superadmin' && <li><a href="/biometric">Biometric Attendance</a></li>} */}
//             <li><a href="/attendance">Attendance</a></li>
//             <li><a href="/Validation">Pay Slip</a></li>
//           </ul>
//         </div>
//         <div className="content-box">
//           <h1>Welcome to the HRMS</h1>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import Navbar from '../components/Navbar';
// import '../components/Home.css';
// import axios from 'axios'; // Import axios for API calls
// import { jwtDecode } from 'jwt-decode'; // Correct named import

// const Home = () => {
//   const [companyExists, setCompanyExists] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
//   const navigate = useNavigate(); // Create navigate object for navigation

//   useEffect(() => {
//     const refreshToken = async () => {
//       const refreshToken = localStorage.getItem('refresh');
//       if (refreshToken) {
//         try {
//           const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
//           const { access } = response.data;
//           localStorage.setItem('access', access); // Save the new access token
//         } catch (error) {
//           console.error('Error refreshing token', error);
//           localStorage.clear();
//           navigate('/login');
//         }
//       } else {
//         console.error('No refresh token found');
//         localStorage.clear();
//         navigate('/login');
//       }
//     };

//     const checkAuthentication = () => {
//       const token = localStorage.getItem('access');
//       if (!token) {
//         console.log('No token found');
//         navigate('/login'); // Redirect to login if no token
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token); // Use the named export for jwtDecode
//         const currentTime = Date.now() / 1000; // Get current time in seconds
//         if (decodedToken.exp < currentTime) {
//           console.log('Token expired');
//           refreshToken(); // Call refreshToken function to get a new access token
//         }
//       } catch (error) {
//         console.error('Invalid token', error);
//         localStorage.clear(); // Clear localStorage if there's an error decoding the token
//         navigate('/login'); // Redirect to login if token is invalid
//       }
//     };

//     const checkCompany = async () => {
//       try {
//         const companyId = localStorage.getItem('companyId');
//         if (companyId) {
//           const response = await axios.get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`, {
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('access')}`
//             }
//           });
//           if (response.data) {
//             setCompanyExists(true);
//           }
//         }
//       } catch (error) {
//         console.error('Error checking company:', error);
//       }
//     };

//     checkAuthentication(); // Check for authentication
//     checkCompany(); // Check for company setup

//   }, [navigate]);

//   const handleCompanySetupClick = () => {
//     if (companyExists) {
//       navigate('/companydetails');
//     } else {
//       navigate('/companysetup');
//     }
//   };

//   const handleSetupClick = () => {
//     setShowDropdown(!showDropdown); // Toggle dropdown visibility
//   };

//   const handleNavigate = (path) => {
//     navigate(path);
//     setShowDropdown(false); // Close dropdown after navigating
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="page-container">
//         <div className="dashboard-box">
//           <ul>
//             <li><a href="#" onClick={handleCompanySetupClick}>Company Setup</a></li>
//             <li className="dropdown">
//               <a href="#" onClick={handleSetupClick}>SetUp</a>
//               {showDropdown && (
//                 <ul className="simple-dropdown">
//                   <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/payroleset')}>Payroll Setup</a></li>
//                   <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/employeesetup')}>Employee Setup</a></li>
//                 </ul>
//               )}
//             </li>
//             <li><a href="/employeelist">Employee List</a></li>
//             <li><a href="/attendance">Attendance</a></li>
//             <li><a href="/Validation">Pay Slip</a></li>
//           </ul>
//         </div>
//         <div className="content-box">
//           <h1>Welcome to the HRMS</h1>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


//get compnaydetails using user id

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import Navbar from '../components/Navbar';
// import '../components/Home.css';
// import axios from 'axios'; // Import axios for API calls
// import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode

// const Home = () => {
//   const [companyExists, setCompanyExists] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
//   const navigate = useNavigate(); // Create navigate object for navigation

//   useEffect(() => {
//     const checkAuthentication = () => {
//       const token = localStorage.getItem('access');
//       if (!token) {
//         console.log('No token found');
//         navigate('/login'); // Redirect to login if no token
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token); // Decode the token to extract userId
//         const currentTime = Date.now() / 1000; // Get current time in seconds
//         if (decodedToken.exp < currentTime) {
//           console.log('Token expired');
//           localStorage.clear(); // Clear localStorage if the token is expired
//           navigate('/login'); // Redirect to login if token has expired
//           return;
//         }

//         const userId = decodedToken.user_id; // Extract userId from decoded token

//         checkCompany(userId); // Pass userId to the function to check company details
//       } catch (error) {
//         console.error('Invalid token', error);
//         localStorage.clear(); // Clear localStorage if there's an error decoding the token
//         navigate('/login'); // Redirect to login if token is invalid
//       }
//     };

//     const checkCompany = async (userId) => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/getcompanydetails/`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('access')}`
//           },
//           params: {
//             user: userId // Pass userId as a query parameter if needed
//           }
//         });

//         if (response.data) {
//           setCompanyExists(true);
//         }
//       } catch (error) {
//         console.error('Error checking company:', error);
//       }
//     };

//     checkAuthentication(); // Check for authentication and company details
//   }, [navigate]);

//   const handleCompanySetupClick = () => {
//     if (companyExists) {
//       navigate('/companydetails');
//     } else {
//       navigate('/companysetup');
//     }
//   };

//   const handleSetupClick = () => {
//     setShowDropdown(!showDropdown); // Toggle dropdown visibility
//   };

//   const handleNavigate = (path) => {
//     navigate(path);
//     setShowDropdown(false); // Close dropdown after navigating
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="page-container">
//         <div className="dashboard-box">
//           <ul>
//             <li><a href="#" onClick={handleCompanySetupClick}>Company Setup</a></li>
//             <li className="dropdown">
//               <a href="#" onClick={handleSetupClick}>SetUp</a>
//               {showDropdown && (
//                 <ul className="simple-dropdown">
//                   <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/payroleset')}>Payroll Setup</a></li>
//                   <li style={{ paddingLeft: '20px' }}><a href="#" onClick={() => handleNavigate('/employeesetup')}>Employee Setup</a></li>
//                 </ul>
//               )}
//             </li>
//             <li><a href="/employeelist">Employee List</a></li>
//             <li><a href="/attendance">Attendance</a></li>
//             <li><a href="/Validation">Pay Slip</a></li>
//           </ul>
//         </div>
//         <div className="content-box">
//           <h1>Welcome to the HRMS</h1>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
