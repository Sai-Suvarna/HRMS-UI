import React from 'react';
import { Grid, TextField } from '@mui/material';

const SalaryDetailsForm = ({ 
  formData, 
  errors, 
  handleChange, 
  setFormData 
}) => {
  return (
    <Grid container spacing={2}>
      {/* Gross Pay */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Employee Gross Pay (CTC)"
          name="CTCpayAMT"
          value={formData.salary_details.CTCpayAMT || ''}
          onChange={(e) => handleChange(e, 'salary_details')}
          error={!!errors.CTCpayAMT}
          helperText={errors.CTCpayAMT}
          type="number"
          variant="outlined"
        />
      </Grid>

      {/* Basic Pay */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Basic Pay"
          name="BasicpayAMT"
          value={formData.salary_details.BasicpayAMT || ''}
          onChange={(e) => handleChange(e, 'salary_details')}
          error={!!errors.BasicpayAMT}
          helperText={errors.BasicpayAMT}
          type="number"
          variant="outlined"
        />
      </Grid>

      {/* HRA Pay */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="HRA Pay"
          name="HRApayAMT"
          value={formData.salary_details.HRApayAMT || ''}
          onChange={(e) => handleChange(e, 'salary_details')}
          error={!!errors.HRApayAMT}
          helperText={errors.HRApayAMT}
          type="number"
          variant="outlined"
        />
      </Grid>

      {/* DA Pay */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="DA Pay"
          name="DApayAMT"
          value={formData.salary_details.DApayAMT || ''}
          onChange={(e) => handleChange(e, 'salary_details')}
          error={!!errors.DApayAMT}
          helperText={errors.DApayAMT}
          type="number"
          variant="outlined"
        />
      </Grid>

      {/* Special Allowances */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Special Allowances"
          name="SAllowancesAMT"
          value={formData.salary_details.SAllowancesAMT || ''}
          onChange={(e) => handleChange(e, 'salary_details')}
          error={!!errors.SAllowancesAMT}
          helperText={errors.SAllowancesAMT}
          type="number"
          variant="outlined"
        />
      </Grid>

      {/* Quarterly Allowance */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Quarterly Allowance"
          name="QAllowanceAMT"
          value={formData.salary_details.QAllowanceAMT || ''}
          onChange={(e) => handleChange(e, 'salary_details')}
          error={!!errors.QAllowanceAMT}
          helperText={errors.QAllowanceAMT}
          type="number"
          variant="outlined"
        />
      </Grid>

      {/* PF Type */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="PF Type"
          name="pf_type"
          value={formData.salary_details.pf_type || ''}
          onChange={(e) => handleChange(e, 'salary_details')}
          error={!!errors.pf_type}
          helperText={errors.pf_type}
          variant="outlined"
          select
          SelectProps={{
            native: true,
          }}
        >
          <option value="">Select PF Type</option>
          <option value="!=15k">No Limit for PF Deduction</option>
          <option value="15k">Wage Limit 15k</option>
        </TextField>
      </Grid>

      {/* Voluntary PF */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Voluntary Provident Fund"
          name="VPFAMT"
          value={formData.salary_details.VPFAMT || ''}
          onChange={(e) => handleChange(e, 'salary_details')}
          error={!!errors.VPFAMT}
          helperText={errors.VPFAMT}
          type="number"
          variant="outlined"
        />
      </Grid>

      {/* Deductions & Loans */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Deductions & Loans"
          name="DLoansAMT"
          value={formData.salary_details.DLoansAMT || ''}
          onChange={(e) => handleChange(e, 'salary_details')}
          error={!!errors.DLoansAMT}
          helperText={errors.DLoansAMT}
          type="number"
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

export default SalaryDetailsForm;