import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; 
import './PayroleSet.css'; 
import axios from 'axios';

const EmployeeCompensationForm = () => {
  const [formData, setFormData] = useState({
        basic_percentage: '50',
        da_enabled: false,
        da_percentage: '0',
        hra_enabled: false,
        hra_percentage: '0',
        variable_pay: false,
        deductions: false,
        quarterly_allowance: false,
        quarterly_bonus: false,
        annual_bonus: false,
        special_allowances: true,
        professional_tax: false,
        esi: false,
        reimbursements: [],
        pf: false,
        voluntary_pf: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const companyId = localStorage.getItem('companyId');
    const [totals, setTotals] = useState({
        basic: 0,
        hra: 0,
        da: 0,
        variablePay: 0,
        quarterlyAllowance: 0,
        quarterlyBonus: 0,
        annualBonus: 0,
        specialAllowance: 0,
        providentFund: 0,
        professionalTax: 0,
        totalEarnings: 0,
        totalDeductions: 0,
        netAmount: 0,
    });

    const calculateBasic = (percentage, grossPay) => grossPay * (percentage / 100);
    const calculateDA = (percentage, grossPay) => grossPay * (percentage / 100);
    const calculateHRA = (basicSalary, percentage) => basicSalary * (percentage / 100);
    const calculateESI = (totalEarnings, providentFund) => {
        let esi = Math.round((totalEarnings - providentFund) * 0.0075);
        return esi;
    };
    const calculateProfessionalTax = (totalEarnings) => {
        if (totalEarnings > 20000) return 200;
        if (totalEarnings > 15000) return 150;
        return 0;
    };
    const calculatePF = (basicSalary, type) => {
        let eePF=0
        if(type === '!=15k') {
            eePF = Math.round(basicSalary * 0.12);
        }
        else if (type === '15k') {
            eePF = Math.round(basicSalary > 15000 ? 15000 * 0.12 : basicSalary * 0.12);
        }
        return eePF;
    };

    const calculateDeductions = useCallback((formData, basicSalary) => {
        let deductions = 0;
        const totalEarnings = totals.totalEarnings;  
        if (formData.professional_tax) deductions += calculateProfessionalTax(totalEarnings);
        if (formData.pf) deductions += calculatePF(basicSalary,formData.pf_type);
        if (formData.esi) deductions += calculateESI(totalEarnings, formData.pf ? calculatePF(basicSalary) : 0);
        if (formData.deductions) deductions += 1000;  // Arbitrary deductions
        if (formData.voluntary_pf) deductions += calculatePF(basicSalary);
      
        return deductions;
    }, [totals.totalEarnings]);
     
    useEffect(() => {
        const grossPay = 36000;
      
        const basic = calculateBasic(formData.basic_percentage, grossPay);
        const da = formData.da_enabled ? calculateDA(formData.da_percentage, grossPay) : 0;
        const hra = calculateHRA(basic, formData.hra_percentage);
        const variablePay = formData.variable_pay ? 2500 : 0;
        const quarterlyAllowance = formData.quarterly_allowance ? 2000 : 0;
        const quarterlyBonus = formData.quarterly_bonus ? 1000 : 0;
        const annualBonus = formData.annual_bonus ? 5000 : 0;
        const specialAllowance =
          grossPay - (basic + da + hra + variablePay + quarterlyAllowance + quarterlyBonus + annualBonus);
        const totalEarnings = 
          basic + da + hra + variablePay + quarterlyAllowance + quarterlyBonus + annualBonus + specialAllowance;
        const totalDeductions = calculateDeductions(formData, basic);
      
        setTotals({
          basic,
          hra,
          da,
          variablePay,
          quarterlyAllowance,
          quarterlyBonus,
          annualBonus,
          specialAllowance,
          providentFund: formData.pf ? calculatePF(basic,formData.pf_type) : 0,  
          professionalTax: formData.professional_tax ? 200 : 0,
          totalEarnings,
          totalDeductions,
          netAmount: totalEarnings - totalDeductions,
        });
    }, [formData, calculateDeductions]);
      
    const reimbursementRows = () => {
        const reimbursementFields = [
          { name: formData.reimbursement1 || 'Reimbursement 1', amount: formData.amount1 },
          { name: formData.reimbursement2 || 'Reimbursement 2', amount: formData.amount2 },
          { name: formData.reimbursement3 || 'Reimbursement 3', amount: formData.amount3 },
          { name: formData.reimbursement4 || 'Reimbursement 4', amount: formData.amount4 },
        ];
      
        // Filter out fields with zero or no amount and map them to table row objects
        return reimbursementFields
          .filter(field => field.amount > 0)
          .map((field, index) => ({
            label: field.name,  // Use the dynamic name
            value: field.amount,
          }));
    };
        
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
    
        setFormData((prev) => {
        // Reset related fields when 'variable_pay' is unchecked
        if (name === "variable_pay" && !updatedValue) {
            return {
            ...prev,
            variable_pay: updatedValue,
            quarterly_allowance: false,
            quarterly_bonus: false,
            annual_bonus: false,
            };
        }
    
        return { ...prev, [name]: updatedValue };
        });
    };
  
    const earningsRows = [
        { label: "Basic Salary", value: totals.basic },
        { label: "Dearness Allowance (DA)", value: totals.da, condition: formData.da_enabled },
        { label: "House Rent Allowance (HRA)", value: totals.hra },
        { label: "Variable Pay", value: totals.variablePay, condition: formData.variable_pay },
        { label: "Quarterly Allowance", value: totals.quarterlyAllowance, condition: formData.quarterly_allowance },
        { label: "Quarterly Bonus", value: totals.quarterlyBonus, condition: formData.quarterly_bonus },
        { label: "Annual Bonus", value: totals.annualBonus, condition: formData.annual_bonus },
        { label: "Special Allowance", value: totals.specialAllowance },
        ...reimbursementRows(),
    ].filter(row => row.condition === undefined || row.condition); // Only include enabled rows

    const deductionRows = () => {
        const deductionFields = [
        { label: "PF", value: totals.providentFund, condition: formData.pf },
        { label: "ESI", value: calculateESI(totals.totalEarnings,totals.providentFund), condition: formData.esi },
        { label: "Professional Tax", value: calculateProfessionalTax(), condition: formData.professional_tax },
        { label: "Deductions & Loans", value: 1000, condition: formData.deductions },
        ];
  
        return deductionFields
        .filter(field => field.condition)  // Only render deductions that are enabled
        .map(field => ({ label: field.label, value: field.value }));
    };
  
    const deductionRowsData = deductionRows();
      
    const handleSubmit = async (e) => {
        e.preventDefault();
   
        console.log('Form submitted');
   
        if (isSubmitting) return;
        setIsSubmitting(true); 

        const reimbursements = {
        reimbursement1: formData.reimbursement1 || 'Reimbursement 1',
        amount1: formData.amount1 || 0,
        reimbursement2: formData.reimbursement2 || 'Reimbursement 2',
        amount2: formData.amount2 || 0,
        reimbursement3: formData.reimbursement3 || 'Reimbursement 3',
        amount3: formData.amount3 || 0,
        reimbursement4: formData.reimbursement4 || 'Reimbursement 4',
        amount4: formData.amount4 || 0,
        };
  
        // Prepare data to store in localStorage
        const dataToStore = {
        basic_percentage: formData.basic_percentage,
        da_percentage: formData.da_percentage,
        hra_percentage: formData.hra_percentage,
        variable_pay: formData.variable_pay,
        deductions: formData.deductions,
        quarterly_allowance: formData.quarterly_allowance,
        quarterly_bonus: formData.quarterly_bonus,
        annual_bonus: formData.annual_bonus,
        special_allowances: formData.special_allowances,
        professional_tax: formData.professional_tax,
        esi: formData.esi,
        pf: formData.pf,
        pf_type: formData.pf_type,
        voluntary_pf: formData.voluntary_pf,
        reimbursements,
        };

        const dataToSubmit = {
          ...formData,
          hra_percentage: formData.hra_enabled ? formData.hra_percentage : '0',
          da_percentage: formData.da_enabled ? formData.da_percentage : '0',
          company: companyId,
      };

        // Store data in localStorage
        // localStorage.setItem('payrollData', JSON.stringify(dataToStore));
        // console.log('Data stored in localStorage:', dataToStore);
    

        try {
        // const response = await axios.post('http://localhost:8000/api/payroledetails/', {
        //     ...formData,
        //     company: companyId,  // Include companyId in the data
        // });
        // Send the data to the API
        const response = await axios.post('http://localhost:8000/api/payroledetails/', dataToSubmit);
        if (response.status === 201) {
            // Handle success
            console.log('Data successfully submitted:', response.data);
        // Redirect to EmployeeSetup
            navigate('/employeesetup'); 
            
        }
        } catch (error) {
        console.error('Error submitting form:', error.response?.data || error.message);
        }finally {
        setIsSubmitting(false); // Enable the button again
        }
    };

  return (
    <div>
      <Navbar />
      <h2>Employee Compensation Form</h2>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="payrole-form-container">
            <h3>Earnings</h3>
            <div className="form-group">
              <label>Basic Percentage:</label>
              <input
                type="number"
                name="basic_percentage"
                value={formData.basic_percentage}
                onChange={handleChange}
                required
              />
              <span className="percentage-symbol">% of Monthly Pay</span>
            </div>

            <div className="form-group">
              <label> Dearness Allowance (DA): </label>
              <input
                type="checkbox"
                name="da_enabled"
                checked={formData.da_enabled}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    da_enabled: e.target.checked,
                    da_percentage: e.target.checked ? prev.da_percentage : '', // Reset if unchecked
                  }))
                }
              />
            </div>

            <div className="form-group">
              <label> HRA: </label>
              <input
                type="checkbox"
                name="hra_enabled"
                checked={formData.hra_enabled}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hra_enabled: e.target.checked,
                    hra_percentage: e.target.checked ? prev.hra_percentage : '', // Reset if unchecked
                  }))
                }
              />
            </div>

            {formData.da_enabled && (
              <div className="form-group">
                <label>DA Percentage:</label>
                <input
                  type="number"
                  name="da_percentage"
                  value={formData.da_percentage}
                  onChange={handleChange}
                  // required
                />
                <span className="percentage-symbol">
                {formData.hra_enabled ? '% of Basic Pay' : '% of Monthly Pay'}</span>
              </div>
            )}
            
            {formData.hra_enabled && (
            <div className="form-group">
              <label>HRA Percentage:</label>
              <input
                type="number"
                name="hra_percentage"
                value={formData.hra_percentage}
                onChange={handleChange}
                // required
              />
              <span className="percentage-symbol">% of Basic Pay</span>
            </div>
            )}
  
            <div className="form-group">
              <label>Variable Pay:</label>
              <input
                type="checkbox"
                name="variable_pay"
                checked={formData.variable_pay}
                onChange={handleChange}
                />
            </div>
  
            {formData.variable_pay && (
              <>
                <div className="form-group">
                  <label>Quarterly Allowance:</label>
                  <input
                    type="checkbox"
                    name="quarterly_allowance"
                    checked={formData.quarterly_allowance}
                    onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                  <label>Quarterly Bonus:</label>
                  <input
                    type="checkbox"
                    name="quarterly_bonus"
                    checked={formData.quarterly_bonus}
                    onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                  <label>Annual Bonus:</label>
                  <input
                    type="checkbox"
                    name="annual_bonus"
                    checked={formData.annual_bonus}
                    onChange={handleChange}
                    />
                </div>
              </>
            )}

            {/* Reimbursement fields */}
            <div className="reimbursement-group">
              <div className="reimbursement-item">
                <input
                  type="text"
                  name="reimbursement1"
                  placeholder="Reimbursement 1"
                  value={formData.reimbursement1}
                  onChange={handleChange}
                  className="reimbursement-input-label"
                />
                <input
                  type="number"
                  name="amount1"
                  placeholder="Amount"
                  value={formData.amount1}
                  onChange={handleChange}
                  className="reimbursement-input"
                />
              </div>

              <div className="reimbursement-item">
                <input
                  type="text"
                  name="reimbursement2"
                  placeholder="Reimbursement 2"
                  value={formData.reimbursement2}
                  onChange={handleChange}
                  className="reimbursement-input-label"
                />
                <input
                  type="number"
                  name="amount2"
                  placeholder="Amount"
                  value={formData.amount2}
                  onChange={handleChange}
                  className="reimbursement-input"
                />
              </div>

              <div className="reimbursement-item">
                <input
                  type="text"
                  name="reimbursement3"
                  placeholder="Reimbursement 3"
                  value={formData.reimbursement3}
                  onChange={handleChange}
                  className="reimbursement-input-label"
                />
                <input
                  type="number"
                  name="amount3"
                  placeholder="Amount"
                  value={formData.amount3}
                  onChange={handleChange}
                  className="reimbursement-input"
                />
              </div>

              <div className="reimbursement-item">
                <input
                  type="text"
                  name="reimbursement4"
                  placeholder="Reimbursement 4"
                  value={formData.reimbursement4}
                  onChange={handleChange}
                  className="reimbursement-input-label"
                />
                <input
                  type="number"
                  name="amount4"
                  placeholder="Amount"
                  value={formData.amount4}
                  onChange={handleChange}
                  className="reimbursement-input"
                />
              </div>
            </div>


            <div className="form-group">
              <label>Special Allowances:</label>
              <input
                type="checkbox"
                name="special_allowances"
                checked={formData.special_allowances}
                onChange={handleChange}
              />
            </div>

            <h3>Deductions</h3>
            <div className="form-group">
              <label>PF:</label>
              <input
                type="checkbox"
                name="pf"
                checked={formData.pf}
                onChange={handleChange}
              />
            </div>
  
            {formData.pf && (
              <div className="form-group">
                <label>PF Type:</label>
                <select
                  name="pf_type"
                  value={formData.pf_type}
                  onChange={handleChange}
                >
                  {/* <option value="">Select PF Type</option> */}
                  <option value="!=15k">No Limit for PF Deduction</option>
                  <option value="15k">Wage limit 15k</option>
                  <option value="Both">Both Options</option>
                </select>
              </div>
            )}

            {formData.pf && (formData.pf_type === "15k" || formData.pf_type === "Both") &&  (
              <div className="form-group">
                <label>Voluntary Provident Fund:</label>
                <input
                type="checkbox"
                name="voluntary_pf"
                checked={formData.voluntary_pf}
                onChange={handleChange}
                />
              </div>
            )}
  
            <div className="form-group">
              <label>ESI:</label>
              <input
                type="checkbox"
                name="esi"
                checked={formData.esi}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Professional Tax:</label>
              <input
                type="checkbox"
                name="professional_tax"
                checked={formData.professional_tax}
                onChange={handleChange}
              />
            </div>
  
            <div className="form-group">
              <label>Deductibles & Loans:</label>
              <input
                type="checkbox"
                name="deductions"
                checked={formData.deductions}
                onChange={handleChange}
              />
            </div>

            <div className = "button"style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              {/* <button type="submit">Submit</button> */}
              <button type="submit" disabled={isSubmitting}>Submit</button>
            </div>
          </div>
        </form>
        <div className="table-container">
          <h1 className="demo-payslip-heading">Demo Payslip</h1>
            <h3>Earnings and Deductions</h3>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Earnings</TableCell>
                            <TableCell>Amount (Rs)</TableCell>
                            <TableCell>Deductions</TableCell>
                            <TableCell>Amount (Rs)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {earningsRows.map((earning, index) => {
                            const deduction = deductionRowsData[index]; // Match deductions row with earnings row (if available)

                            return (
                            <TableRow key={`row-${index}`}>
                                {/* Earnings Column */}
                                <TableCell>{earning.label}</TableCell>
                                <TableCell>{earning.value} </TableCell>

                                {/* Deductions Column */}
                                <TableCell>{deduction ? deduction.label : ''}</TableCell>
                                <TableCell>{deduction ? deduction.value : ''} </TableCell>
                            </TableRow>
                            );
                        })}

                        {/* Render remaining deduction rows, if any, after earnings are exhausted */}
                        {deductionRowsData.slice(earningsRows.length).map((deduction, index) => (
                            <TableRow key={`extra-deduction-${index}`}>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>{deduction.label}</TableCell>
                            <TableCell>{deduction.value} Rs</TableCell>
                            </TableRow>
                        ))}

                        {/* Total Row */}
                        <TableRow className="total-row">
                            <TableCell>Total Earnings (Gross Pay)</TableCell>
                            <TableCell>{totals.totalEarnings} Rs</TableCell>
                            <TableCell>Total Deductions</TableCell>
                            <TableCell>{totals.totalDeductions} Rs</TableCell>
                        </TableRow>

                        {/* Net Amount Row */}
                        <TableRow className="total-row">
                            <TableCell colSpan={2}>Net Amount Paid</TableCell>
                            <TableCell colSpan={2}>{totals.netAmount} Rs</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="ctc-info">
                  **Gross Pay = 36000
            </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCompensationForm;




