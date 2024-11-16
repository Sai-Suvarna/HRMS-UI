import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import Home from './pages/Home';
// import HomePage from './components/HomePage';
import CompanySetup from './components/CompanySetup';
import EmployeeSetup from './components/EmployeeSetup';
import EmployeeSetup2 from './components/EmployeeSetup2';

// import PayroleSetup from './components/PayroleSetup';
import EmployeeList from './components/EmployeeList';
import TimeSheetPage from './components/TimeSheetPage';
import PaySlipValidation from './components/PaySlipValidation';
import EmployeeSetupGrid from './components/EmployeeSetupGrid';
import PayroleSet from './components/PayroleSet';

import Logout from './pages/Logout';
import CompanyDetails from './components/CompanyDetails';
import Validation from './components/Validation';
import ProtectedRoute from "./components/ProtectedRoute"

import './App.css';

function RegisterAndLogout() {
  localStorage.clear()
  return <RegisterForm />
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<HomePage />} />   */}
          <Route path="/" element={<LoginForm />} />   
 
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/companysetup" element={<ProtectedRoute><CompanySetup /></ProtectedRoute>} />
          <Route path="/employeesetup" element={<EmployeeSetup />} />

          <Route path="/employeesetup2" element={<ProtectedRoute> <EmployeeSetup2 /> </ProtectedRoute>} />
      
          {/* <Route path="/payrolesetup" element={<PayroleSetup />} /> */}
          <Route path="/employeelist" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
          <Route path="/EmployeeSetupGrid" element={<ProtectedRoute><EmployeeSetupGrid /></ProtectedRoute>} /> 
          <Route path="/Attendance" element={<ProtectedRoute><TimeSheetPage /></ProtectedRoute>} />
          <Route path="/payroleset" element={<ProtectedRoute><PayroleSet/></ProtectedRoute>} />
          <Route path="/payslipvalidation" element={<ProtectedRoute><PaySlipValidation /></ProtectedRoute>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/companydetails" element={<ProtectedRoute> <CompanyDetails /> </ProtectedRoute>} /> 
          <Route path="/Validation" element={<ProtectedRoute><Validation /></ProtectedRoute>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
