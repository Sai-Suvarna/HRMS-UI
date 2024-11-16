import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const PersonalDetailsFields = ({ formData, errors, handleChange, setFormData }) => {
  return <>

            <TextField
              label="Personal Email ID"
              name="personalEmailId"
              defaultValue={formData.personal_details.personalEmailId}
              value={formData.personal_details.personalEmailId }
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.personalEmailId}
              helperText={errors.personalEmailId}
              required
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth *"
                value={dayjs(formData.personal_details.dob)}
                // defaultValue={formData.personal_details.dob}
                // onChange={(date) => setFormData({ ...formData, dob: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  personal_details: { ...prevFormData.personal_details, dob: date },
                }))}
                renderInput={(params) => <TextField {...params} fullWidth  error={!!errors.dob}
                helperText={errors.dob}/>}
               
                required
              />
            </LocalizationProvider> */}

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Date of Birth *"
    value={formData.personal_details.dob ? dayjs(formData.personal_details.dob) : null}  // Use null if no value
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      personal_details: { ...prevFormData.personal_details, dob: date },
    }))}
    renderInput={(params) => <TextField {...params} fullWidth error={!!errors.dob} helperText={errors.dob} />}
    required
  />
</LocalizationProvider>
            <TextField
              select
              label="Gender"
              name="gender"
              defaultValue={formData.personal_details.gender}
              value={formData.personal_details.gender}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.gender}
              helperText={errors.gender}
              required
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              label="Educational Qualification"
              name="educationalQualification"
              defaultValue={formData.personal_details.educationalQualification}
              value={formData.personal_details.educationalQualification}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.educationalQualification}
              helperText={errors.educationalQualification}
            />
            <TextField
              select
              label="Marital Status"
              name="maritalStatus"
              defaultValue={formData.personal_details.maritalStatus}
              value={formData.personal_details.maritalStatus}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.maritalStatus}
              helperText={errors.maritalStatus}
              required
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </TextField>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Marriage Date"
                value={dayjs(formData.personal_details.marriageDate)}
                // defaultValue={formData.personal_details.marriageDate}
                // onChange={(date) => setFormData({ ...formData, marriageDate: date })}
                onChange={(date) => setFormData((prevFormData) => ({
                  ...prevFormData,
                  personal_details: { ...prevFormData.personal_details, marriageDate: date },
                }))}
                // renderInput={(params) => <TextField {...params} fullWidth  error={false}
                // helperText={errors.marriageDate} />}
                slotProps={{
                    textField:{
                        error:false
                    }
                }}
               
              />
             
            </LocalizationProvider> */}

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Marriage Date"
    value={formData.personal_details.marriageDate ? dayjs(formData.personal_details.marriageDate) : null}  // Use null if no value
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      personal_details: { ...prevFormData.personal_details, marriageDate: date },
    }))}
    slotProps={{
      textField: {
        error: false
      }
    }}
  />
</LocalizationProvider>
              <TextField
              select
              label="Blood Group"
              name="bloodGroup"
              defaultValue={formData.personal_details.bloodGroup}
              value={formData.personal_details.bloodGroup}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.bloodGroup}
              helperText={errors.bloodGroup}
            >
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
            </TextField>
            <TextField
              label="Shirt Size"
              name="shirtSize"
              defaultValue={formData.personal_details.shirtSize}
              value={formData.personal_details.shirtSize}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.shirtSize}
              helperText={errors.shirtSize}
            />
            <TextField
              label="Current Address"
              name="currentAddress"
              defaultValue={formData.personal_details.currentAddress}
              value={formData.personal_details.currentAddress}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.currentAddress}
              helperText={errors.currentAddress}
              required
            />
            <TextField
              label="Permanent Address"
              name="permanentAddress"
              defaultValue={formData.personal_details.permanentAddress}
              value={formData.personal_details.permanentAddress}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.permanentAddress}
              helperText={errors.permanentAddress}
              required
            />
            <TextField
              label="General Contact (10 digits)"
              name="generalContact"
              defaultValue={formData.personal_details.generalContact}
              value={formData.personal_details.generalContact}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.generalContact}
              helperText={errors.generalContact}
              required
            />
            <TextField
              label="Emergency Contact (10 digits)"
              name="emergencyContact"
              defaultValue={formData.personal_details.emergencyContact}
              value={formData.personal_details.emergencyContact}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.emergencyContact}
              helperText={errors.emergencyContact}
              required
            />
            <TextField
              select
              label="Relationship"
              name="relationship"
              defaultValue={formData.personal_details.relationship}
              value={formData.personal_details.relationship}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.relationship}
              helperText={errors.relationship}
              required
            >
              <MenuItem value="Parent">Parent</MenuItem>
              <MenuItem value="Sibling">Sibling</MenuItem>
              <MenuItem value="Spouse">Spouse</MenuItem>
              <MenuItem value="Friend">Friend</MenuItem>
            </TextField>
            <TextField
              label="Relationship Name"
              name="relationshipName"
              defaultValue={formData.personal_details.relationshipName}
              value={formData.personal_details.relationshipName}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.relationshipName}
              helperText={errors.relationshipName}
              required
            />
            <TextField
              label="Work Location"
              name="location"
              defaultValue={formData.personal_details.location}
              value={formData.personal_details.location || ''}
              onChange={(e)=>{handleChange(e,"personal_details")}}
              fullWidth
              error={!!errors.location}
              helperText={errors.location}
              required
            />
              </>
    };

export default PersonalDetailsFields;
