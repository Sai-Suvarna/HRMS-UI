import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa'; 
import Navbar from '../pages/Navbar';
import '../styles/EmployeeList.css'
import api from "../api";
import { BiAddToQueue } from "react-icons/bi";


const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

useEffect(() => {

  const fetchEmployees = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error("Company ID is missing");
      }
  
      const response = await api.get(`/api/employee/`, {
        params: { company_id: companyId },
      });
  
      setEmployees(response.data.employees); 
    } catch (err) {
      setError('Error fetching employees');
      console.error('Error fetching employees:', err);
    }
  };
  
  
    fetchEmployees();
  }, []);

  const handleAddNewEmployee = () => {
    navigate('/employeesetup2'); 
  };

  const handleGridView = () => {
    navigate('/EmployeeSetupGrid'); 
  };

  const handleEditEmployee = (employeeData) => {
    console.log("Data", employeeData);
    navigate('/employeesetup2', { 
      state: { 
        employeeData,
        isEditMode: true 
      } 
    });
  };

  const handleRehireClick = (employee) => {
    navigate('/employeesetup2', {
      state: { employeeData: employee, isEditMode: true, isRehireMode: true }
    });
  };
  

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar />  
      <div>
        <h2>Employee List</h2>
        <button onClick={handleAddNewEmployee} className="add-button">
          Add New Employee
        </button>

        <button onClick={handleGridView} className="add-button">
          View All Employees
        </button>

        <div className="list-container">
          <table >
            <thead >
              <tr>
                <th>Emp ID</th>
                <th>Work Details</th>
                <th>Social Security</th>
                <th>Personal Details</th>
                <th>Insurance Details</th>
                <th>Salary Details</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.work_details.wdId}>
                     <td>
        {employee.work_details.empId}
        {employee.work_details.employmentStatus === 'Active' ? (
          <FaEdit
            style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}
            onClick={() => handleEditEmployee(employee)}
          />
        ) : (
          <BiAddToQueue
            style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}
            onClick={() => handleRehireClick(employee)}
            
          />
        )}
      </td>

                  <td>
                    <div>Name: {employee.work_details.firstName} {employee.work_details.lastName}</div>
                    <div>Employment Status: {employee.work_details.employmentStatus}</div>
                    <div>Comapny Email Id: {employee.work_details.companyEmailId}</div>
                    <div>Date of Joining: {employee.work_details.dateOfJoining}</div>
                    <div>Date of Relieving: {employee.work_details.dateOfRelieving}</div>
                    <div>Department: {employee.work_details.department}</div>
                    <div>Group: {employee.work_details.group}</div>
                    <div>Role Type: {employee.work_details.roleType}</div>
                    <div>Current Role: {employee.work_details.currentRole}</div>
                    <div>Reporting Manager: {employee.work_details.reportingManager}</div>
                    <div>Reason for leaving: {employee.work_details.reasonForLeaving}</div>
                    <div>Month and Year Of Termination: {employee.work_details.monthYearOfTermination}</div>
                    <div>Total exp in this Company: {employee.work_details.totalExpInThisCompany}</div>
                    <div> total exp before joining: {employee.work_details.totalExpBeforeJoining}</div>
                    <div>Total Experience: {employee.work_details.totalExperience}</div>
                    <div>Previous Date Of Joining: {employee.work_details.previousDateOfJoining}</div>
                    <div>Previous Employer: {employee.work_details.previousEmployer}</div>

                    
                  </td>
                  
                  <td>
                    <div>PAN: {employee.social_security_details.panNum}</div>
                    <div>UAN: {employee.social_security_details.uanNum}</div>
                    <div>Aadhar: {employee.social_security_details.aadharNum}</div>
                    <div>Bank Name: {employee.social_security_details.bankName}</div>
                    <div>IFSC Code: {employee.social_security_details.ifscCode}</div>
                    <div>Bank Account Number: {employee.social_security_details.bankAccountNumber}</div>
                  </td>
                  <td>
                    <div>Personal Email Id: {employee.personal_details.personalEmailId}</div>
                    <div>Gender: {employee.personal_details.gender}</div>
                    <div>DOB: {employee.personal_details.dob}</div>
                    <div>Educational Qualification: {employee.personal_details.educationalQualification}</div>
                    <div>Marital Status: {employee.personal_details.maritalStatus}</div>
                    <div>Marriage Date: {employee.personal_details.marriageDate}</div>
                    <div>Current Address: {employee.personal_details.currentAddress}</div>
                    <div>Permanent Address: {employee.personal_details.permanentAddress}</div>
                    <div>General Contact: {employee.personal_details.generalContact}</div>
                    <div>Emergency Contact: {employee.personal_details.emergencyContact}</div>
                    <div>Relationship: {employee.personal_details.relationship}</div>
                    <div>Relationship Name: {employee.personal_details.relationshipName}</div>
                    <div>Blood Group: {employee.personal_details.bloodGroup}</div>
                    <div>Shirt Size: {employee.personal_details.shirtSize}</div>
                    <div>Location: {employee.personal_details.location}</div>
                  </td>
                  <td>
                    <div>Father's Name: {employee.insurance_details.fathersName}</div>
                    <div>Father's DOB: {employee.insurance_details.fathersDOB}</div>
                    <div>Mother's Name: {employee.insurance_details.mothersName}</div>
                    <div>Mother's DOB: {employee.insurance_details.mothersDOB}</div>
                    <div>Spouse Name: {employee.insurance_details.spouseName}</div>
                    <div>Spouse DOB: {employee.insurance_details.spouseDOB}</div>
                    <div>Child1 Name: {employee.insurance_details.child1}</div>
                    <div>Child1 DOB: {employee.insurance_details.child1DOB}</div>
                    <div>Child2 Name: {employee.insurance_details.child2}</div>
                    <div>Child2 DOB: {employee.insurance_details.child2DOB}</div>

                  </td>

                  <td>
                    <div>CTC: {employee.salary_details.CTCpayAMT}</div>
                    <div>Basic Pay: {employee.salary_details.BasicpayAMT}</div>
                    <div>Dearness Allowance: {employee.salary_details.DApayAMT}</div>
                    <div>HRA: {employee.salary_details.HRApayAMT}</div>
                    <div>Special Allowance: {employee.salary_details.SAllowancesAMT}</div>
                    <div>Deductions & Loans: {employee.salary_details.DLoansAMT}</div>

                   

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;