
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Navbar from './Navbar'; 
// import './PaySlipValidation.css';


// const EmpSalaryDetails = () => {
//     const [salaryDetails, setSalaryDetails] = useState([]);

//     // Fetch salary details from the API
//     useEffect(() => {
//         const fetchEmployees = async () => {
//           try {
//             const companyId = localStorage.getItem('companyId');  // Fetch company ID from local storage
//             const response = await axios.get(`http://localhost:8000/api/employee/?company_id=${companyId}`);
//             setSalaryDetails(response.data.employees);  // Set the filtered employee list
//           } catch (err) {
//             // setError('Error fetching employees');
//             console.error(err);
//           }
//         };
      
//         fetchEmployees();
//       }, []);
    

//     return (
//         <div>
//         <Navbar />  
//         <div>
//             <h2>Employee Salary Details</h2>
//             <div className="validation-table-container">

//             <table>
//                 <thead>
//                     <tr>
//                         <th>Employee ID</th>
//                         <th>Employee Name</th>
//                         <th>Role</th>
//                         <th>Gross Pay</th>
//                         <th>Basic Pay</th>
//                         <th>HRA</th>
//                         {/* <th>Advances</th> */}
//                         <th>Variable Pay</th>
//                         <th>Quarterly Allowance</th>
//                         <th>Quarterly Bonus</th>
//                         <th>Annual Bonus</th>
//                         <th>Special Allowances</th>
//                         <th>Professional Tax</th>
//                         <th>PF</th>
//                         <th>ESI</th>
//                         <th>Deducted Loans</th>
//                         <th>VPF</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {salaryDetails.map((salary_details) => (
//                         <tr key={salary_details.sdId}>
//                             <td>{salary_details.wdId}</td>
//                             <td>{salary_details.CTCpayAMT}</td>
//                             <td>{salary_details.BasicpayAMT}</td>
//                             <td>{salary_details.HRApayAMT}</td>
                           
                            
//                             <td>{salary_details.SAllowancesAMT}</td>
                           
//                             <td>{salary_details.DLoansAMT}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             </div>
//         </div>
//     </div>
//     );
// };

// export default EmpSalaryDetails;


import React, { useState, useEffect } from 'react';
import Navbar from '../pages/Navbar'; 
import '../styles/PaySlipValidation.css';
import api from "../api";
import { fetchUserId, fetchCompanyId } from '../helpers/CompanyId';



const EmpSalaryDetails = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [error, setError] = useState(''); // State for managing error messages

    // Fetch employee and salary details from the API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
            //   const companyId = localStorage.getItem('companyId');
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

              if (!companyId) {
                throw new Error('Company ID not found in localStorage.');
              }
          
              const response = await api.get('/api/employee/', {
                params: { company_id: companyId }, // Pass query parameters in a clean way
              });
          
              // Transform the API response data
              const employees = response.data.employees.map(employee => ({
                empId: employee.work_details.empId,
                fullName: `${employee.work_details.firstName} ${employee.work_details.lastName}`,
                role: employee.work_details.currentRole,
                salaryDetails: employee.salary_details,
              }));
          
              setEmployeeData(employees); // Update the state with transformed data
            } catch (err) {
              console.error('Error fetching employees:', err.response?.data || err.message);
              setError('Unable to fetch employees. Please try again later.'); // Display user-friendly error
            }
          };
          

        fetchEmployees();
    }, []);

    return (
        <div>
            <Navbar />  
            <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* Render employee data */}
                <h2>Employee Salary Details</h2>
                <div className="validation-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Role</th>
                                <th>Gross Pay</th>
                                <th>Basic Pay</th>
                                <th>HRA</th>
                                <th>Special Allowances</th>
                                <th>Deducted Loans</th>
                                <th>PF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeData.map((employee, index) => (
                                <tr key={index}>
                                    <td>{employee.empId}</td>
                                    <td>{employee.fullName}</td>
                                    <td>{employee.role}</td>
                                    <td>{employee.salaryDetails.CTCpayAMT}</td>
                                    <td>{employee.salaryDetails.BasicpayAMT}</td>
                                    <td>{employee.salaryDetails.HRApayAMT}</td>
                                    <td>{employee.salaryDetails.SAllowancesAMT}</td>
                                    <td>{employee.salaryDetails.DLoansAMT}</td>
                                    <td>1800</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmpSalaryDetails;
