import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs, { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const EmployeeWorkDetailsForm = ({ formData, errors, handleChange, setFormData, handleEmpIdChange, isRehireMode }) => {
  console.log("Date",formData.work_details.dateOfJoining)

  return <>

    <TextField
      label="Employee ID"
      name="empId"
      defaultValue={formData.work_details.empId}
      value={formData.work_details.empId}
      onChange={(e) => {
        handleChange(e, 'work_details');
        handleEmpIdChange(e); // Add this line to call the function when empId changes
      }}
      // onChange={(e)=>{handleChange(e,"work_details")}}
      fullWidth
      // error={!!errors.empId}
      error={errors.empId && <span className="error">{errors.empId}</span>}
      helperText={errors.empId}
      required
                
    />
    <TextField
      label="First Name"
      name="firstName"
      value={formData.work_details.firstName}
      onChange={(e)=>{handleChange(e,"work_details")}}
      defaultValue={formData.work_details.firstName}
      fullWidth
      error={!!errors.firstName}
      helperText={errors.firstName}
      required
    />
    <TextField
      label="Last Name"
      name="lastName"
      defaultValue={formData.work_details.lastName}
      value={formData.work_details.lastName}
      onChange={(e)=>{handleChange(e,"work_details")}}
      fullWidth
      error={!!errors.lastName}
      helperText={errors.lastName}
      required
    />
    <TextField
      select
      label="Employment Status"
      name="employmentStatus"
      defaultValue={formData.work_details.employmentStatus}
      value={formData.work_details.employmentStatus}
      onChange={(e)=>{handleChange(e,"work_details")}}
      fullWidth
      error={!!errors.employmentStatus}
      helperText={errors.employmentStatus}
      required>
        <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="terminated">Terminated</MenuItem>
        </TextField>
  
    <TextField
      label="Company Email ID"
      name="companyEmailId"
      defaultValue={formData.work_details.companyEmailId}
      value={formData.work_details.companyEmailId}
      onChange={(e)=>{handleChange(e,"work_details")}}
      fullWidth
      error={!!errors.companyEmailId}
      helperText={errors.companyEmailId}
      required
    />
    
    <TextField 
    label="Group" 
    name="group" 
    defaultValue={formData.work_details.group}
    value={formData.work_details.group}
    onChange={(e)=>{handleChange(e,"work_details")}}
    fullWidth
    error={!!errors.group}
    helperText={errors.group}
    />

    <TextField
      label="Department"
      name="department"
      defaultValue={formData.work_details.department}
      value={formData.work_details.department}
      onChange={(e)=>{handleChange(e,"work_details")}}
      fullWidth
      error={!!errors.department}
      helperText={errors.department}
      required
    />
     <TextField
      label="Role Type"
      name="roleType"
      defaultValue={formData.work_details.roleType}
      onChange={(e)=>{handleChange(e,"work_details")}}
      fullWidth
      value={formData.work_details.roleType}
      error={!!errors.roleType}
      helperText={errors.roleType}
    />
    <TextField
      label="Current Role"
      name="currentRole"
      defaultValue={formData.work_details.currentRole}
      value={formData.work_details.currentRole}
      onChange={(e)=>{handleChange(e,"work_details")}}
      fullWidth
      error={!!errors.currentRole}
      helperText={errors.currentRole}
      required
    />
    <TextField
      label="Reporting Manager"
      name="reportingManager"
      defaultValue={formData.work_details.reportingManager}
      value={formData.work_details.reportingManager}
      onChange={(e)=>{handleChange(e,"work_details")}}
      fullWidth
      error={!!errors.reportingManager}
      helperText={errors.reportingManager}
      required
    />
    <TextField 
      label="Previous Employer" 
      name="previousEmployer" 
      defaultValue={formData.work_details.previousEmployer}
      value={formData.work_details.previousEmployer}
      fullWidth
      error={!!errors.previousEmployer}
      helperText={errors.previousEmployer} 
      onChange={(e)=>{handleChange(e,"work_details")}}
      />
    <TextField 
    label="Experience Before Joining" 
    name="totalExpBeforeJoining" 
    defaultValue={formData.work_details.totalExpBeforeJoining}
    value={formData.work_details.totalExpBeforeJoining}
    error={!!errors.totalExpBeforeJoining}
    helperText={errors.totalExpBeforeJoining}
    fullWidth
    onChange={(e)=>{handleChange(e,"work_details")}}
    placeholder='Ex: 2 yr 5 mon'
    />
    <TextField 
    label="Reason for Leaving" 
    name="reasonForLeaving" 
    value={formData.work_details.reasonForLeaving}
    error={!!errors.reasonForLeaving}
    helperText={errors.reasonForLeaving}
    onChange={(e)=>{handleChange(e,"work_details")}}
    fullWidth
    />
    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Date of Joining"
        
        value={dayjs(formData.work_details.dateOfJoining)}
        defaultValue={formData.work_details.dateOfJoining}
        onChange={(date) => setFormData((prevFormData) => ({
          ...prevFormData,
          work_details: { ...prevFormData.work_details, dateOfJoining: date },
        }))}
        renderInput={(params) => (
          <TextField {...params} fullWidth error={!!errors.dateOfJoining} helperText={errors.dateOfJoining} 
          required 
          />
        )}
      />

      <DatePicker
        label="Date of Relieving"
        value={dayjs(formData.work_details.dateOfRelieving)}
        // defaultValue={formData.work_details.dateOfRelieving}
        // onChange={(date) => setFormData({ ...formData, dateOfRelieving: date })}
        onChange={(date) => setFormData((prevFormData) => ({
          ...prevFormData,
          work_details: { ...prevFormData.work_details, dateOfRelieving: date },
        }))}
        // renderInput={(params) => <TextField {...params} fullWidth />}
        slotProps={{
          textField:{
              error:false
          }
      }}
      />
      <DatePicker
        label="Previous Date of Joining"
        value={dayjs(formData.work_details.previousDateOfJoining)}
        // defaultValue={formData.work_details.previousDateOfJoining}
        // onChange={(date) => setFormData({ ...formData, previousDateOfJoining: date })}
        onChange={(date) => setFormData((prevFormData) => ({
          ...prevFormData,
          work_details: { ...prevFormData.work_details, previousDateOfJoining: date },
        }))}
        // renderInput={(params) => <TextField {...params} fullWidth />}
        slotProps={{
          textField:{
              error:false
          }
      }}
      />
    </LocalizationProvider> */}

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Date of Joining"
    value={formData.work_details.dateOfJoining ? dayjs(formData.work_details.dateOfJoining) : null}  // Handle null/undefined
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      work_details: { ...prevFormData.work_details, dateOfJoining: date },
    }))}
    renderInput={(params) => (
      <TextField {...params} fullWidth error={!!errors.dateOfJoining} helperText={errors.dateOfJoining} required />
    )}
  />

  <DatePicker
    label="Date of Relieving"
    value={formData.work_details.dateOfRelieving ? dayjs(formData.work_details.dateOfRelieving) : null}  // Handle null/undefined
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      work_details: { ...prevFormData.work_details, dateOfRelieving: date },
    }))}
    slotProps={{
      textField: {
        error: false
      }
    }}
  />

  <DatePicker
    label="Previous Date of Joining"
    value={formData.work_details.previousDateOfJoining ? dayjs(formData.work_details.previousDateOfJoining) : null}  // Handle null/undefined
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      work_details: { ...prevFormData.work_details, previousDateOfJoining: date },
    }))}
    slotProps={{
      textField: {
        error: false
      }
    }}
  />
</LocalizationProvider>

   
    </>
};

export default EmployeeWorkDetailsForm;
