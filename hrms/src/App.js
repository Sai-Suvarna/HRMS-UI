import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import Home from "./pages/Home";
// import HomePage from './components/HomePage';
import CompanySetup from "./components/CompanySetup";
import EmployeeSetup from "./components/EmployeeSetup";
import EmployeeSetup2 from "./components/EmployeeSetup2";

import BiometricAttd from "./components/BiometricAttd";

// import PayroleSetup from './components/PayroleSetup';
import EmployeeList from "./components/EmployeeList";
import TimeSheetPage from "./components/TimeSheetPage";
import PaySlipValidation from "./components/PaySlipValidation";
import EmployeeSetupGrid from "./components/EmployeeSetupGrid";
import PayroleSet from "./components/PayroleSet";

import Logout from "./pages/Logout";
import CompanyDetails from "./components/CompanyDetails";
import Validation from "./components/Validation";
import ProtectedRoute from "./components/ProtectedRoute";

import UploadTemplate from "./components/UploadTemplate";
import GenerateLetter from "./components/GenerateLetter";

import AdminAccountManagerRegister from "./pages/AdminAccountManagerRegister";
import EmployeeRegister from "./pages/EmployeeRegister";
import EmployeeDetails from "./components/EmployeeDetails";
import "./App.css";

function RegisterAndLogout() {
  localStorage.clear();
  return <RegisterForm />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/adminregister"
            element={<AdminAccountManagerRegister />}
          />
          <Route
            path="/employeeregister"
            element={
              <ProtectedRoute restrict={true}>
                <EmployeeRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeedetails"
            element={
              <ProtectedRoute>
                <EmployeeDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute >
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companysetup"
            element={
              <ProtectedRoute restrict={true}>
                <CompanySetup />
              </ProtectedRoute>
            }
          />
          <Route path="/employeesetup" element={<EmployeeSetup />} />

          <Route
            path="/employeesetup2"
            element={
              <ProtectedRoute restrict={true}>
                <EmployeeSetup2 />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employeelist"
            element={
              <ProtectedRoute restrict={true}>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EmployeeSetupGrid"
            element={
              <ProtectedRoute restrict={true}>
                <EmployeeSetupGrid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Attendance"
            element={
              <ProtectedRoute restrict={true}>
                <TimeSheetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroleset"
            element={
              <ProtectedRoute restrict={true}>
                <PayroleSet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payslipvalidation"
            element={
              <ProtectedRoute restrict={true}>
                <PaySlipValidation />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/companydetails"
            element={
              <ProtectedRoute restrict={true}>
                <CompanyDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Validation"
            element={
              <ProtectedRoute restrict={true}>
                <Validation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/biometric"
            element={
              <ProtectedRoute restrict={true}>
                <BiometricAttd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uploadtemplate"
            element={
              <ProtectedRoute restrict={true}>
                <UploadTemplate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generateletter"
            element={
              <ProtectedRoute restrict={true}>
                <GenerateLetter />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
