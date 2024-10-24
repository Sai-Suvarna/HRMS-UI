
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; 
import './payslipvalidation.css'; // Import the updated CSS


const EmpSalaryDetails = () => {
    const [salaryDetails, setSalaryDetails] = useState([]);

    // Fetch salary details from the API
    useEffect(() => {
        axios.get('/api/salarydetails/')
            .then(response => {
                setSalaryDetails(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the salary details!', error);
            });
    }, []);

    return (
        <div>
        <Navbar />  
        <div>
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
                        {/* <th>Advances</th> */}
                        <th>Variable Pay</th>
                        <th>Quarterly Allowance</th>
                        <th>Quarterly Bonus</th>
                        <th>Annual Bonus</th>
                        <th>Special Allowances</th>
                        <th>Professional Tax</th>
                        <th>PF</th>
                        <th>ESI</th>
                        <th>Deducted Loans</th>
                        <th>VPF</th>
                    </tr>
                </thead>
                <tbody>
                    {salaryDetails.map((detail) => (
                        <tr key={detail.sdId}>
                            <td>{detail.wdId}</td>
                            <td>{detail.CTCpayAMT}</td>
                            <td>{detail.BasicpayAMT}</td>
                            <td>{detail.HRApayAMT}</td>
                            <td>{detail.AdvancesAMT}</td>
                            <td>{detail.VariableAMT}</td>
                            <td>{detail.QAllowanceAMT}</td>
                            <td>{detail.QBonusAMT}</td>
                            <td>{detail.ABonusAMT}</td>
                            <td>{detail.SAllowancesAMT}</td>
                            <td>{detail.PTAMT}</td>
                            <td>{detail.PFAMT}</td>
                            <td>{detail.ESIAMT}</td>
                            <td>{detail.DLoansAMT}</td>
                            <td>{detail.VPFAMT}</td>
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