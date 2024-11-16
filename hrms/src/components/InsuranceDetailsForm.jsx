// InsuranceDetailsForm.js
import React from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const InsuranceDetailsForm = ({ formData, errors, handleChange, setFormData }) => {
  return <>
   <TextField
        label="Father Name"
        name="fathersName"
        defaultValue={formData.insurance_details.fathersName}
        value={formData.insurance_details.fathersName}
        onChange={(e)=>{handleChange(e,"insurance_details")}}
        fullWidth
        error={!!errors.fathersName}
        helperText={errors.fathersName}
    />
    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
        label="Father DOB"
        value={dayjs(formData.insurance_details.fathersDOB)}
        // defaultValue={formData.insurance_details.fathersDOB}
        // onChange={(date) => setFormData({ ...formData, fathersDOB: date })}
        onChange={(date) => setFormData((prevFormData) => ({
          ...prevFormData,
          insurance_details: { ...prevFormData.insurance_details, fathersDOB: date },
        }))}
        // renderInput={(params) => (
        //     <TextField {...params} fullWidth error={!!errors.fathersDOB} helperText={errors.fathersDOB} />
        // )}
        slotProps={{
            textField:{
                error:false
            }
        }}
        />
    </LocalizationProvider> */}

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Father DOB"
    value={formData.insurance_details.fathersDOB ? dayjs(formData.insurance_details.fathersDOB) : null}  // Use null if no value
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      insurance_details: { ...prevFormData.insurance_details, fathersDOB: date },
    }))}
    slotProps={{
      textField: {
        error: false
      }
    }}
  />
</LocalizationProvider>

    <TextField
        label="Mother Name"
        name="mothersName"
        defaultValue={formData.insurance_details.mothersName}
        value={formData.insurance_details.mothersName}
        onChange={(e)=>{handleChange(e,"insurance_details")}}
        fullWidth
        error={!!errors.mothersName}
        helperText={errors.mothersName}
    />
   {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
        label="Mother DOB"
        value={dayjs(formData.insurance_details.mothersDOB)}
        // defaultValue={formData.insurance_details.mothersDOB}
        // onChange={(date) => setFormData({ ...formData, mothersDOB: date })}
        onChange={(date) => setFormData((prevFormData) => ({
          ...prevFormData,
          insurance_details: { ...prevFormData.insurance_details, mothersDOB: date },
        }))}
        // renderInput={(params) => (
        //     <TextField {...params} fullWidth error={!!errors.mothersDOB} helperText={errors.mothersDOB} />
        // )}
        slotProps={{
            textField:{
                error:false
            }
        }}
        />
    </LocalizationProvider> */}

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Mother DOB"
    value={formData.insurance_details.mothersDOB ? dayjs(formData.insurance_details.mothersDOB) : null}  // Use null if no value
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      insurance_details: { ...prevFormData.insurance_details, mothersDOB: date },
    }))}
    slotProps={{
      textField: {
        error: false
      }
    }}
  />
</LocalizationProvider>


    <TextField
        label="Spouse Name"
        name="spouseName"
        defaultValue={formData.insurance_details.spouseName}
        value={formData.insurance_details.spouseName}
        onChange={(e)=>{handleChange(e,"insurance_details")}}
        fullWidth
        error={!!errors.spouseName}
        helperText={errors.spouseName}
    />            
    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
        label="Spouse DOB"
        // defaultValue={formData.insurance_details.spouseDOB}
        value={dayjs(formData.insurance_details.spouseDOB)}
        onChange={(date) => setFormData((prevFormData) => ({
          ...prevFormData,
          insurance_details: { ...prevFormData.insurance_details, spouseDOB: date },
        }))}
        // onChange={(date) => setFormData({ ...formData, spouseDOB: date })}
        // renderInput={(params) => (
        //     <TextField {...params} fullWidth error={!!errors.spouseDOB} helperText={errors.spouseDOB} />
        // )}
        slotProps={{
            textField:{
                error:false
            }
        }}
        />
    </LocalizationProvider> */}

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Spouse DOB"
    value={formData.insurance_details.spouseDOB ? dayjs(formData.insurance_details.spouseDOB) : null}  // Use null if no value
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      insurance_details: { ...prevFormData.insurance_details, spouseDOB: date },
    }))}
    slotProps={{
      textField: {
        error: false
      }
    }}
  />
</LocalizationProvider>

    <TextField
        label="Child1 Name"
        name="child1"
        defaultValue={formData.insurance_details.child1}
        value={formData.insurance_details.child1}
        onChange={(e)=>{handleChange(e,"insurance_details")}}
        fullWidth
        error={!!errors.child1}
        helperText={errors.child1}
    />
    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
        label="Child1 DOB"
        value={dayjs(formData.insurance_details.child1Dob)}
        // defaultValue={formData.insurance_details.child1DOB}
        // onChange={(date) => setFormData({ ...formData, child1DOB: date })}
        onChange={(date) => setFormData((prevFormData) => ({
          ...prevFormData,
          insurance_details: { ...prevFormData.insurance_details, child1DOB: date },
        }))}
        // renderInput={(params) => (
        //     <TextField {...params} fullWidth error={!!errors.child1DOB} helperText={errors.child1DOB} />
        // )}
        slotProps={{
            textField:{
                error:false
            }
        }}
        />
    </LocalizationProvider> */}

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Child1 DOB"
    value={formData.insurance_details.child1DOB ? dayjs(formData.insurance_details.child1DOB) : null}  // Use null if no value
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      insurance_details: { ...prevFormData.insurance_details, child1DOB: date },
    }))}
    slotProps={{
      textField: {
        error: false
      }
    }}
  />
</LocalizationProvider>


    <TextField
        label="Child2 Name"
        name="child2"
        defaultValue={formData.insurance_details.child2}
        value={formData.insurance_details.child2}
        onChange={(e)=>{handleChange(e,"insurance_details")}}
        fullWidth
        error={!!errors.child2}
        helperText={errors.child2}
    />

    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
        label="Child2 DOB"
        value={dayjs(formData.insurance_details.child2DOB)}
        // defaultValue={formData.insurance_details.child2DOB}
        // onChange={(date) => setFormData({ ...formData, child2DOB: date })}
        onChange={(date) => setFormData((prevFormData) => ({
          ...prevFormData,
          insurance_details: { ...prevFormData.insurance_details, child2DOB: date },
        }))}
        // renderInput={(params) => (
        //     <TextField {...params} fullWidth error={!!errors.child2DOB} helperText={errors.child2DOB} />
        // )}
        slotProps={{
            textField:{
                error:false
            }
        }}
        />
    </LocalizationProvider> */}
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Child2 DOB"
    value={formData.insurance_details.child2DOB ? dayjs(formData.insurance_details.child2DOB) : null}  // Use null if no value
    onChange={(date) => setFormData((prevFormData) => ({
      ...prevFormData,
      insurance_details: { ...prevFormData.insurance_details, child2DOB: date },
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

export default InsuranceDetailsForm;
