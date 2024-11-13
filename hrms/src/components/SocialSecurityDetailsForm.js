import React from 'react';
import TextField from '@mui/material/TextField';

const SocialSecurityDetailsForm = ({ formData, errors, handleChange }) => {
  return <>
    
         <TextField
              label="PAN Number"
              name="panNum"
              defaultValue={formData.social_security_details.panNum}
              value={formData.social_security_details.panNum}
              onChange={(e)=>{handleChange(e,"social_security_details")}}
              fullWidth
              error={!!errors.panNum}
              helperText={errors.panNum}
              required
            />
              <TextField
              label="IFSC Code"
              name="ifscCode"
              defaultValue={formData.social_security_details.ifscCode}
              value={formData.social_security_details.ifscCode}
              onChange={(e)=>{handleChange(e,"social_security_details")}}
              fullWidth
              error={!!errors.ifscCode}
              helperText={errors.ifscCode}
              required
            /> 
      <TextField
        label="Aadhar Number"
        name="aadharNum"
        value={formData.social_security_details.aadharNum || ""}
        onChange={(e) => handleChange(e, "social_security_details")}
        fullWidth
        error={!!errors.aadharNum}
        helperText={errors.aadharNum}
        required
      />
      <TextField
        label="Bank Name"
        name="bankName"
        value={formData.social_security_details.bankName || ""}
        onChange={(e) => handleChange(e, "social_security_details")}
        fullWidth
        error={!!errors.bankName}
        helperText={errors.bankName}
        required
      />
      <TextField
        label="UAN Number"
        name="uanNum"
        value={formData.social_security_details.uanNum || ""}
        onChange={(e) => handleChange(e, "social_security_details")}
        fullWidth
        error={!!errors.uanNum}
        helperText={errors.uanNum}
        required
      />
      <TextField
        label="Bank Account Number"
        name="bankAccountNumber"
        value={formData.social_security_details.bankAccountNumber || ""}
        onChange={(e) => handleChange(e, "social_security_details")}
        fullWidth
        error={!!errors.bankAccountNumber}
        helperText={errors.bankAccountNumber}
        required
      />
    </>
  
};

export default SocialSecurityDetailsForm;
