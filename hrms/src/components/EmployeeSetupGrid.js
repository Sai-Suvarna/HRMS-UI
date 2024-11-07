
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './EmployeeSetupGrid.css'; // Ensure this is correctly linked
import { jwtDecode } from 'jwt-decode'; 


const EmployeeSetupGrid = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

   // Function to check JWT token validity
 const checkJWTToken = () => {
  const token = localStorage.getItem('access');
  if (!token) {
    navigate('/login');
    return;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      // Token expired, redirect to login
      localStorage.removeItem('access');
      navigate('/login');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    navigate('/login');
  }
};

useEffect(() => {
  checkJWTToken();
}, []);

  useEffect(() => {
    // Check if the JWT token is valid before fetching compensation settings
  checkJWTToken();
    const fetchEmployees = async () => {
      try {
        const companyId = localStorage.getItem('companyId');  // Fetch company ID from local storage
        const response = await axios.get(`http://localhost:8000/api/employee/?company_id=${companyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`, // Pass the token in the header
          },
        });
        // const response = await axios.get(`http://localhost:8000/api/employee/?company_id=${companyId}`);
        setEmployees(response.data.employees);  // Set the filtered employee list
      } catch (err) {
        setError('Error fetching employees');
        console.error(err);
      }
    };
  
    fetchEmployees();
  }, []);
  const handleAddNewEmployee = () => {
    navigate('/employeesetup'); // Adjust the path if needed
  };

  const handleTableView = () => {
    navigate('/employeelist'); // Adjust the path if needed
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar />  {/* Add Navbar here */}
      <div>
        <h2>Employee List</h2>
        <button onClick={handleAddNewEmployee} className="add-button">
          Add New Employee
        </button>

        <button onClick={handleTableView} className="add-button">
          Table View
        </button>

        <div className="table-gridcontainer">
          <table className="employee-gridtable">
            <thead>
              {/* Main Headers */}
              <tr>
                <th rowSpan="2">Emp ID</th>
                <th colSpan="17">Work Details</th>
                <th colSpan="6">Social Security</th>
                <th colSpan="15">Personal Details</th>
                <th colSpan="10">Insurance Details</th>
                <th colSpan="6">Salary Details</th>

              </tr>

              {/* Sub-columns */}
              <tr>
                {/* Work Details */}
                <th>Name</th>
                <th>Status</th>
                <th>Company Email</th>
                <th>Date of Joining</th>
                <th>Date of Relieving</th>
                <th>Department</th>
                <th>Group</th>
                <th>Role Type</th>
                <th>Current Role</th>
                <th>Reporting Manager</th>
                <th>Reason for leaving</th>
                <th>Mon&Yr of Termination</th>
                <th>Total exp in this company</th>
                <th>Previous exp</th>
                <th>Total exp</th>
                <th>Previous Date of Joining</th>
                <th>Previous Employer</th>

                {/* Social Security */}
                <th>PAN Num</th>
                <th>UAN Num</th>
                <th>Aadhar Num</th>
                <th>Bank Name</th>
                <th>IFSC</th>
                <th>Account Num</th>


                {/* Personal Details */}
                <th>Personal Email</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Education</th>
                <th>Marital Status</th>
                <th>Marriage Date</th>
                <th>Current Address</th>
                <th>Permanent Address</th>
                <th>General Contact</th>
                <th>Emergency Contact</th>
                <th>Relationship</th>
                <th>Relationship Name</th>
                <th>Blood Group</th>
                <th>Shirt Size</th>
                <th>Location</th>

                {/* Insurance Details */}
                <th>Father's Name</th>
                <th>Father's DOB</th>
                <th>Mother's Name</th>
                <th>Mother's DOB</th>
                <th>Spouse Name</th>
                <th>Spouse DOB</th>
                <th>Child1 Name</th>
                <th>Child1 DOB</th>
                <th>Child2 Name</th>
                <th>Child2 DOB</th>

                {/* Salary Details */}
                <th>CTC</th>
                <th>Basic Pay</th>
                <th>Dearness Allowance</th>
                <th>HRA</th>
                <th>Special Allowance</th>
                <th>Deductions & Loans</th>

                

              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.work_details.wdId}>
                  {/* Emp ID */}
                  <td>{employee.work_details.empId}</td>

                  {/* Work Details */}
                  <td> {`${employee.work_details.firstName} ${employee.work_details.lastName}`}</td>
                  <td> {employee.work_details.employmentStatus}</td>
                  <td> {employee.work_details.companyEmailId}</td>
                  <td> {employee.work_details.dateOfJoining}</td>
                  <td> {employee.work_details.dateOfRelieving} </td>
                  <td> {employee.work_details.department}</td>
                  <td> {employee.work_details.group} </td>
                  <td> {employee.work_details.roleType} </td>
                  <td> {employee.work_details.currentRole}</td>
                  <td> {employee.work_details.reportingManager} </td>
                  <td> {employee.work_details.reasonForLeaving}</td>
                  <td> {employee.work_details.monthYearOfTermination} </td>
                  <td> {employee.work_details.totalExpInThisCompany} </td>
                  <td> {employee.work_details.totalExpBeforeJoining}</td>
                  <td> {employee.work_details.totalExperience}</td>
                  <td> {employee.work_details.previousDateOfJoining} </td>
                  <td> {employee.work_details.previousEmployer}</td>

                  {/* Social Security */}
                  <td> {employee.social_security_details.panNum}</td>
                  <td> {employee.social_security_details.uanNum}</td>
                  <td> {employee.social_security_details.aadharNum}</td> 
                  <td> {employee.social_security_details.bankName} </td>
                  <td> {employee.social_security_details.ifscCode}</td>
                  <td> {employee.social_security_details.bankAccountNumber}</td>

                  {/* Personal Details */}
                  <td> {employee.personal_details.personalEmailId}</td>
                  <td> {employee.personal_details.gender}</td>
                  <td> {employee.personal_details.dob}</td>
                  <td> {employee.personal_details.educationalQualification}</td> {/* Added education field */}
                  <td> {employee.personal_details.maritalStatus} </td>
                  <td> {employee.personal_details.marriageDate} </td>
                  <td> {employee.personal_details.currentAddress}</td>
                  <td> {employee.personal_details.permanentAddress} </td>
                  <td> {employee.personal_details.generalContact}</td>
                  <td> {employee.personal_details.emergencyContact} </td>
                  <td> {employee.personal_details.relationship} </td>
                  <td> {employee.personal_details.relationshipName} </td>
                  <td> {employee.personal_details.bloodGroup}</td>
                  <td> {employee.personal_details.shirtSize}</td>
                  <td> {employee.personal_details.location}</td>


                  {/* Insurance Details */}
                  <td>{employee.insurance_details.fathersName}</td>
                  <td>{employee.personal_details.fathersDOB}</td>
                  <td>{employee.insurance_details.mothersName}</td>
                  <td>{employee.insurance_details.mothersDOB}</td>
                  <td>{employee.insurance_details.spouseName}</td>
                  <td>{employee.insurance_details.spouseDOB}</td>
                  <td>{employee.insurance_details.child1}</td>
                  <td>{employee.insurance_details.child1DOB}</td>
                  <td>{employee.insurance_details.child2}</td>
                  <td>{employee.insurance_details.child2DOB}</td>

                  {/* Salary Details*/}
                  <td>{employee.salary_details.CTCpayAMT}</td>
                  <td>{employee.salary_details.BasicpayAMT}</td>
                  <td>{employee.salary_details.DApayAMT}</td>
                  <td>{employee.salary_details.HRApayAMT}</td>
                  <td>{employee.salary_details.SAllowancesAMT}</td>
                  <td>{employee.salary_details.DLoansAMT}</td> 

                </tr>


              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSetupGrid;