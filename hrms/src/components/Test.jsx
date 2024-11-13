// src/components/Logout.js
import { TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Test = () => {

  

  return <>
  <TextField
  label="PAN Number"
  name="panNum"
//   defaultValue={}
//   value={formData.social_security_details.panNum}
//   onChange={(e)=>{handleChange(e,"social_security_details")}}
  fullWidth
//   error={!!errors.panNum}
//   helperText={errors.panNum}
  required
/> 
  <TextField
              label="IFSC Code"
              name="ifscCode"
            //   defaultValue={formData.social_security_details.ifscCode}
            //   value={formData.social_security_details.ifscCode}
            //   onChange={(e)=>{handleChange(e,"social_security_details")}}
              fullWidth
            //   error={!!errors.ifscCode}
            //   helperText={errors.ifscCode}
              required
            />
  </>
   // No UI needed, purely functional
};

export default Test;





