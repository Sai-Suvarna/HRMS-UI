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
          <Route path="/companysetup" element={<CompanySetup />} />
          <Route path="/employeesetup" element={<EmployeeSetup />} />

          <Route path="/employeesetup2" element={<ProtectedRoute> <EmployeeSetup2 /> </ProtectedRoute>} />
      
          {/* <Route path="/payrolesetup" element={<PayroleSetup />} /> */}
          <Route path="/employeelist" element={<EmployeeList />} />
          <Route path="/EmployeeSetupGrid" element={<EmployeeSetupGrid />} /> 
          <Route path="/Attendance" element={<TimeSheetPage />} />
          <Route path="/payslipvalidation" element={<payslipvalidation />} />
          <Route path="/payroleset" element={<PayroleSet/>} />
          <Route path="/payslipvalidation" element={<PaySlipValidation />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/companydetails" element={<CompanyDetails />} /> {/* Add route */}
          <Route path="/Validation" element={<Validation />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
