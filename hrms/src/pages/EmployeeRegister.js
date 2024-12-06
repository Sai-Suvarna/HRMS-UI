import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { fetchUserId, fetchCompanyId } from "../helpers/CompanyId";
import Navbar from "./Navbar";

const EmployeeRegister = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (formData.password !== formData.confirmPassword) {
  //     setError('Passwords do not match');
  //     return;
  //   }

  //   try {
  //     const userId = await fetchUserId();
  //     if (!userId) {
  //       setError('User ID not found');
  //       return;
  //     }

  //     const companyId = await fetchCompanyId(userId);
  //     if (!companyId) {
  //       setError('Company ID not found');
  //       return;
  //     }

  //      // Append companyId to formData
  //     const updatedFormData = { ...formData, company: companyId };

  //     const response = await api.post('/api/register/employee/', updatedFormData);
  //     if (response.status === 201) {
  //       setSuccess(true);
  //       setError('');
  //       setTimeout(() => navigate('/home'), 1500);
  //     }
  //   } catch (err) {
  //     setError('Error registering the user.');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userId = await fetchUserId();
      if (!userId) {
        setError("User ID not found");
        return;
      }

      const companyId = await fetchCompanyId(userId);
      if (!companyId) {
        setError("Company ID not found");
        return;
      }

      // Append companyId to formData
      const updatedFormData = { ...formData, company: companyId };

      const response = await api.post(
        "/api/register/employee/",
        updatedFormData
      );

      if (response.status === 201) {
        setSuccess(true);
        setError("");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        // Handle error messages from the response
        if (response.data && response.data.error) {
          setError(response.data.error); // Show the exact error message returned from the backend
        } else {
          setError("Error registering the user."); // Fallback error message
        }
      }
    } catch (err) {
      console.log("ERR;", err.response.data.error);
      setError(err.response.data.error);
    }
  };

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          maxWidth: 400,
          margin: "0 auto",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Employee Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          {success && (
            <Typography color="success.main">
              Registration successful!
            </Typography>
          )}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default EmployeeRegister;
