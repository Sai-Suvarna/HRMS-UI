import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { fetchUserId, fetchRole, fetchUserName, fetchCompanyId } from '../helpers/CompanyId';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import api from '../api';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar = () => {
  const [companyName, setCompanyName] = useState('Default Company');
  const [companyLogo, setCompanyLogo] = useState('/default-company-logo.png');
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [showModal, setShowModal] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const userId = await fetchUserId();
        if (!userId) {
          setError('User ID not found');
          return;
        }

        const role = await fetchRole();
        if (!role) {
          setError('Role not found');
          return;
        }

        setRole(role); // Store role in the state

        const userName = await fetchUserName(userId);
        if (!userName) {
          setError('Username not found');
          return;
        }

        setUserName(userName); // Store username in the state

        if (role === 'Super Admin') {
          // Set Solivar details for Super Admin
          setCompanyName('Solivar');
          setCompanyLogo(null);
          } else {
          const companyId = await fetchCompanyId(userId);
          if (!companyId) {
            setError('Company ID not found');
            return;
          }

        // const companyId = await fetchCompanyId(userId);
        // if (!companyId) {
        //   setError('Company ID not found');
        //   return;
        // }

        // Fetch company details
        const response = await api.get(`/api/companydetails/retrieve/${companyId}/`);
        const companyDetails = response.data;
        setCompanyName(companyDetails.companyName || 'Default Company');
        if (companyDetails.logo_url) {
          setCompanyLogo(`http://localhost:8000${companyDetails.logo_url}`);
        }
      }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="logo.png" alt="Solivar Logo" className="app-logo" />
      </div>
{/* 
      <div className="navbar-center">
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
        <h1 className="company-name">{companyName}</h1>
      </div> */}

      <div className="navbar-center">
        {companyLogo && (
          <img src={companyLogo} alt="Company Logo" className="company-logo" />
        )}
        <h1 className="company-name">{companyName}</h1>
      </div>

      <div className="navbar-right">
        <ul className="navbar-links">
          <li>
            <Link to="/Home">Dashboard</Link>
          </li>
        </ul>

       
        <div className="navbar-profile">
          <AccountCircleIcon
            className="profile-icon"
            style={{ fontSize: '3rem', cursor: 'pointer' }}
            onClick={() => setShowModal((prev) => !prev)} // Toggle modal visibility
          />
          {showModal && (
            <div className="modal-below-icon">
              <AccountCircleIcon  style={{ fontSize: '4rem' }} />

              <p><strong>Name:</strong> {userName}</p>
              <p><strong>Role:</strong> {role}</p>
              
            </div>
          )}
        </div>

        <div className="navbar-logout">
          <ExitToAppIcon
            className="profile-icon"
            style={{ fontSize: '2.8rem', cursor: 'pointer'  }}
            onClick={handleLogout} />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;





// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/Navbar.css';
// import { fetchUserId, fetchRole, fetchUserName, fetchCompanyId } from '../helpers/CompanyId';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import api from '../api';

// const Navbar = () => {
//   const [companyName, setCompanyName] = useState('Default Company');
//   const [companyLogo, setCompanyLogo] = useState('/default-company-logo.png');
//   const [error, setError] = useState(null);
//   const [userName, setUserName] = useState('');
//   const [role, setRole] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCompanyDetails = async () => {
//       try {
//         const userId = await fetchUserId();
//         if (!userId) {
//           setError('User ID not found');
//           return;
//         }

//         const role = await fetchRole();
//         if (!role) {
//           setError('Role not found');
//           return;
//         }

//         setRole(role); // Store role in the state

//         const userName = await fetchUserName(userId);
//         if (!userName) {
//           setError('Username not found');
//           return;
//         }

//         setUserName(userName); // Store username in the state

//         const companyId = await fetchCompanyId(userId);
//         if (!companyId) {
//           setError('Company ID not found');
//           return;
//         }

//         // Fetch company details
//         const response = await api.get(`/api/companydetails/retrieve/${companyId}/`);
//         const companyDetails = response.data;
//         setCompanyName(companyDetails.companyName || 'Default Company');
//         if (companyDetails.logo_url) {
//           setCompanyLogo(`http://localhost:8000${companyDetails.logo_url}`);
//         }
//       } catch (error) {
//         console.error('Error fetching company details:', error);
//       }
//     };

//     fetchCompanyDetails();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <img src="logo.png" alt="Solivar Logo" className="app-logo" />
//       </div>

//       <div className="navbar-center">
//         <img src={companyLogo} alt="Company Logo" className="company-logo" />
//         <h1 className="company-name">{companyName}</h1>
//       </div>

//       <div className="navbar-right">
       
//         <ul className="navbar-links">
//           <li>
//             <Link to="/Home">Dashboard</Link>
//           </li>
//           <li>
//             <Link to="/login" onClick={handleLogout}>Logout</Link>
//           </li>
//         </ul>

//         <div className="navbar-profile">
//         <AccountCircleIcon className="profile-icon" style={{ fontSize: '3rem' }} />

//           <div className="profile-info">
//             <span className="profile-username">{userName}</span>
//             <span className="profile-role">{role}</span>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;






//working code with dynamic logo with authentication without refreshtoken

// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/Navbar.css';
// import api from "../api";
// import { fetchUserId, fetchCompanyId, fetchRole} from '../helpers/CompanyId';

// const Navbar = () => {
//   const [companyName, setCompanyName] = useState('Default Company');
//   const [companyLogo, setCompanyLogo] = useState('/default-company-logo.png'); 
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCompanyDetails = async () => {
//       try {
//         // const companyId = localStorage.getItem('companyId');
//       const userId = await fetchUserId();
//       if (!userId) {
//         setError('User ID not found');
//         return;
//       }

//       const role = await fetchRole(); // Fetch userId using helper function
//       console.log("Role:",role)
//       if (!role) {
//         setError('Role not found');
//         return;
//       }
  
//       const companyId = await fetchCompanyId(userId);
//       if (!companyId) {
//         setError('Company ID not found');
//         return;
//       }

//         if (!companyId) {
//           console.error('Company ID not found');
//           return;
//         }

//         // Fetch company details using async/await
//         const response = await api.get(`/api/companydetails/retrieve/${companyId}/`);

//         const companyDetails = response.data;
//         setCompanyName(companyDetails.companyName || 'Default Company');
//         if (companyDetails.logo_url) {
//           setCompanyLogo(`http://localhost:8000${companyDetails.logo_url}`);
//         }
//       } catch (error) {
//         console.error('Error fetching company details:', error);
//       }
//     };

//     fetchCompanyDetails();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <img src="logo.png" alt="Solivar Logo" className="app-logo" />
//         {/* <h1 className="app-name">HRMS</h1> */}
//       </div>

//       <div className="navbar-center">
//         <img src={companyLogo} alt="Company Logo" className="company-logo" />
//         <h1 className="company-name">{companyName}</h1>
//       </div>

//       <ul className="navbar-links navbar-right">
//         <li>
//           <Link to="/Home">Dashboard</Link>
//         </li>
//         <li>
//           <Link to="/login" onClick={handleLogout}>Logout</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode'; 
// import './Navbar.css'; // Add your custom styles here

// const Navbar = () => {
//   const [companyName, setCompanyName] = useState('Default Company');
//   const [companyLogo, setCompanyLogo] = useState('/default-company-logo.png'); // Provide a default company logo path
//   const navigate = useNavigate();

//   useEffect(() => {
//     const companyId = localStorage.getItem('companyId');

//     if (!companyId) {
//       console.error('Company ID not found');
//       return;
//     }

//     const accessToken = localStorage.getItem('access');
//     const refreshToken = localStorage.getItem('refresh');

//     const checkAndRefreshToken = async () => {
//       if (accessToken) {
//         const decodedToken = jwtDecode(accessToken);
//         const currentTime = Date.now() / 1000;

//         if (decodedToken.exp < currentTime) {
//           console.error('Access token has expired');

//           if (refreshToken) {
//             const decodedRefreshToken = jwtDecode(refreshToken);
//             if (decodedRefreshToken.exp > currentTime) {
//               try {
//                 // Request new access token using the refresh token
//                 const response = await axios.post('http://localhost:8000/api/token/refresh/', {
//                   refresh: refreshToken,
//                 });

//                 if (response.data && response.data.access) {
//                   localStorage.setItem('access', response.data.access);
//                   console.log('Access token refreshed');
//                   return;
//                 }
//               } catch (error) {
//                 console.error('Error refreshing access token:', error);
//                 localStorage.clear(); // Clear tokens and redirect to login
//                 navigate('/login');
//               }
//             } else {
//               console.error('Refresh token has expired');
//               localStorage.clear();
//               navigate('/login');
//             }
//           } else {
//             console.error('No refresh token found');
//             localStorage.clear();
//             navigate('/login');
//           }
//         }
//       } else {
//         console.error('No access token found');
//         navigate('/login');
//       }
//     };

//     checkAndRefreshToken();

//     axios
//       .get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('access')}`
//         }
//       })
//       .then(response => {
//         const companyDetails = response.data;
//         setCompanyName(companyDetails.companyName || 'Default Company');
//         if (companyDetails.logo_url) {
//           setCompanyLogo(`http://localhost:8000${companyDetails.logo_url}`);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching company details:', error);
//       });
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <img src="logo.png" alt="Solivar Logo" className="app-logo" />
//         {/* <h1 className="app-name">HRMS</h1> */}
//       </div>

//       <div className="navbar-center">
//         <img src={companyLogo} alt="Company Logo" className="company-logo" />
//         <h1 className="company-name">{companyName}</h1>
//       </div>

//       <ul className="navbar-links navbar-right">
//         <li>
//           <Link to="/Home">Dashboard</Link>
//         </li>
//         <li>
//           <Link to="/login" onClick={handleLogout}>Logout</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;


//get company details using userId
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import{ jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode
// import './Navbar.css'; // Add your custom styles here

// const Navbar = () => {
//   const [companyName, setCompanyName] = useState('Default Company');
//   const [companyLogo, setCompanyLogo] = useState('/default-company-logo.png'); // Provide a default company logo path
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('access');

//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000;

//         // Check if the token is expired
//         if (decodedToken.exp < currentTime) {
//           console.error('Token has expired');
//           localStorage.clear(); // Clear expired token
//           navigate('/login');
//           return;
//         }

//         const userId = decodedToken.user_id; // Get userId from token

//         axios
//           .get(`http://localhost:8000/api/getcompanydetails/`, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             },
//             params: {
//               user: userId // Pass userId as a parameter
//             }
//           })
//           .then(response => {
//             const companyDetails = response.data;
//             console.log("Data",companyDetails)

//              // Check and update state only if the response has the expected data
//           if (companyDetails.companyName) {
//             setCompanyName(companyDetails.companyName);
//           }
//           if (companyDetails.logo_url) {
//             setCompanyLogo(`http://localhost:8000${companyDetails.logo_url}`);
//           }

//           console.log('Name:', companyDetails.companyName);

//           console.log('Logo URL:', `http://localhost:8000${companyDetails.logo_url}`);


//             // setCompanyName(companyDetails.companyName || 'Default Company');
//             // if (companyDetails.logo_url) {
//             //   setCompanyLogo(`http://localhost:8000${companyDetails.logo_url}`);
//             // }
//           })
//           .catch(error => {
//             console.error('Error fetching company details:', error);
//           });
//       } catch (error) {
//         console.error('Invalid token:', error);
//         localStorage.clear();
//         navigate('/login');
//       }
//     } else {
//       console.error('No token found');
//       navigate('/login');
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <img src="logo.png" alt="Solivar Logo" className="app-logo" />
//         {/* <h1 className="app-name">HRMS</h1> */}
//       </div>

//       <div className="navbar-center">
//         <img src={companyLogo} alt="Company Logo" className="company-logo" />
//         <h1 className="company-name">{companyName}</h1>
//       </div>

//       <ul className="navbar-links navbar-right">
//         <li>
//           <Link to="/Home">Dashboard</Link>
//         </li>
//         <li>
//           <Link to="/login" onClick={handleLogout}>Logout</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
