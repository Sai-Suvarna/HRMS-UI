import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomePage from './components/HomePage';
import CompanySetup from './components/CompanySetup';
import EmployeeSetup from './components/EmployeeSetup';
import PayroleSetup from './components/PayroleSetup';
import EmployeeList from './components/EmployeeList';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />   {/* Home page route */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/companysetup" element={<CompanySetup />} />
          <Route path="/employeesetup" element={<EmployeeSetup />} />
          <Route path="/payrolesetup" element={<PayroleSetup />} />
          <Route path="/employeelist" element={<EmployeeList />} />




        </Routes>
      </div>
    </Router>
  );
}

export default App;
