
//working code with dynamic logo with authentication without refreshtoken

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import here
// import './Navbar.css'; 
import '../styles/Navbar.css';
import api from "../api";



const Navbar = () => {
  const [companyName, setCompanyName] = useState('Default Company');
  const [companyLogo, setCompanyLogo] = useState('/default-company-logo.png'); 
  const navigate = useNavigate();

  // useEffect(() => {
  //   const companyId = localStorage.getItem('companyId');

  //   if (!companyId) {
  //     console.error('Company ID not found');
  //     return;
  //   }

  //   // const token = localStorage.getItem('access');

  //   // if (token) {
  //   //   const decodedToken = jwtDecode(token);
  //   //   const currentTime = Date.now() / 1000;
      
  //   //   // Check if the token is expired
  //   //   if (decodedToken.exp < currentTime) {
  //   //     console.error('Token has expired');
  //   //     localStorage.clear(); // Clear expired token
  //   //     navigate('/login');
  //   //   }
  //   // }

  //   // axios
  //   //   .get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`, {
  //   //     headers: {
  //   //       'Authorization': `Bearer ${token}`
  //   //     }
  //   //   })
  //      axios
  //     .get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`)
  //     .then(response => {
  //       const companyDetails = response.data;
  //       setCompanyName(companyDetails.companyName || 'Default Company');
  //       if (companyDetails.logo_url) {
  //         setCompanyLogo(`http://localhost:8000${companyDetails.logo_url}`);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching company details:', error);
  //     });
  // }, [navigate]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyId = localStorage.getItem('companyId');

        if (!companyId) {
          console.error('Company ID not found');
          return;
        }

        // Fetch company details using async/await
        const response = await api.get(`/api/companydetails/retrieve/${companyId}/`);

        const companyDetails = response.data;
        setCompanyName(companyDetails.companyName || 'Default Company');
        if (companyDetails.logo_url) {
          setCompanyLogo(`http://localhost:8000${companyDetails.logo_url}`);
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
        {/* <h1 className="app-name">HRMS</h1> */}
      </div>

      <div className="navbar-center">
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
        <h1 className="company-name">{companyName}</h1>
      </div>

      <ul className="navbar-links navbar-right">
        <li>
          <Link to="/Home">Dashboard</Link>
        </li>
        <li>
          <Link to="/login" onClick={handleLogout}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

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
