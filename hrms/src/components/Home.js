// import React from 'react';
// import Navbar from '../components/Navbar';
// import '../components/Home.css';

// const Home = () => {
//   return (
//     <div>
//       <Navbar />
//       <div className="page-container">
//         <div className="dashboard-box">
//           <h3>Dashboard</h3>
//           <ul>
//             <li><a href="/companysetup">Company Setup</a></li>
//             <li><a href="/payrolesetup">Payroll Setup</a></li>
//             <li><a href="/employeesetup">Employee Setup</a></li>
//             <li><a href="/employeelist">Employee List</a></li>
//             <li><a href="/Attendance">Attendance</a></li>
//             <li><a href="/payslipvalidation">Pay Slip</a></li>
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import Navbar from '../components/Navbar';
import '../components/Home.css';
import axios from 'axios'; // Import axios for API calls

const Home = () => {
  const [companyExists, setCompanyExists] = useState(false);
  const navigate = useNavigate(); // Create navigate object for navigation

  useEffect(() => {
    // Fetch company existence status when the component mounts
    const checkCompany = async () => {
      try {
        const companyId = localStorage.getItem('companyId');
        if (companyId) {
          // You can also call your API to verify if the company exists
          const response = await axios.get(`http://localhost:8000/api/companydetails/retrieve/${companyId}/`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          if (response.data) {
            setCompanyExists(true); // Set to true if company details are returned
          }
        }
      } catch (error) {
        console.error('Error checking company:', error);
      }
    };

    checkCompany();
  }, []);

  const handleCompanySetupClick = () => {
    if (companyExists) {
      // Navigate to Company Details if company exists
      navigate('/companydetails');
    } else {
      // Navigate to Company Setup if no company exists
      navigate('/companysetup');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="dashboard-box">
          {/* <h3>Dashboard</h3> */}
          <ul>
            <li>
              <a href="#" onClick={handleCompanySetupClick}>Company Setup</a>
            </li>
            <li><a href="/payrolesetup">Payroll Setup</a></li>
            <li><a href="/employeesetup">Employee Setup</a></li>
            <li><a href="/employeelist">Employee List</a></li>
            <li><a href="/PaySlipValid">Pay Slip</a></li>
            <li><a href="/attendance">Attendance</a></li>
            <li><a href="/payslipvalidation">Pay Slip</a></li>
          </ul>
        </div>
        <div className="content-box">
          <h1>Welcome to the HRMS</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
