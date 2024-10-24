// Home Page.js

import React from 'react';
import Navbar from '../components/Navbar';
import '../components/Home.css';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="dashboard-box">
          <h3>Dashboard</h3>
          <ul>
            <li><a href="/companysetup">Company Setup</a></li>
            <li><a href="/payrolesetup">Payroll Setup</a></li>
            <li><a href="/employeesetup">Employee Setup</a></li>
            <li><a href="/employeelist">Employee List</a></li>
            <li><a href="/Attendance">Attendance</a></li>
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