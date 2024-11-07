import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; 
// import './PayroleSetup.css'; 
import './PayroleSet.css';
import { useNavigate } from 'react-router-dom';

const PayroleSetup = () => {
  const [formData, setFormData] = useState({
    basic_percentage: '50',
    da_enabled: false,
    da_percentage: '0',
    hra_percentage: '20',
    // advances: false,
    variable_pay: false,
    deductions: false,
    quarterly_allowance: false,
    quarterly_bonus: false,
    annual_bonus: false,
    special_allowances: true,
    professional_tax: false,
    esi: false,
    esi_percentage: '',
    pf: false,
    pf_type: '',
    // voluntary_pf:'',
    voluntary_pf: false,
    reimbursements: []
  });

  const [totals, setTotals] = useState({
    basic: 0,
    hra: 0,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateBasic = (percentage, grossPay) => grossPay * (percentage / 100);
  const calculateDA = (percentage, grossPay) => grossPay * (percentage / 100);
  const calculateHRA = (basicSalary, percentage) => basicSalary * (percentage / 100);
  const calculatePF = (basicSalary) => basicSalary * 0.12;  // PF is 12% of Basic Salary
  const calculateDeductions = useCallback((formData, basicSalary) => {
    let deductions = 0;
    
    if (formData.professional_tax) deductions += 200; 
    if (formData.pf) deductions += calculatePF(basicSalary); 
    // if (formData.advances) deductions += 500;  
    if (formData.esi) deductions += 500;  
    if (formData.deductions) deductions += 1000;  
    if (formData.voluntary_pf) deductions += calculatePF(basicSalary);
    
  
    return deductions;
  }, []);

  // const addReimbursement = () => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     reimbursements: [
  //       ...prevData.reimbursements, 
  //       { name: `Reimbursement ${prevData.reimbursements.length + 1}`, checked: false }
  //     ]
  //   }));
  // };  

  // const handleReimbursementChange = (index, checked) => {
  //   const newReimbursements = [...formData.reimbursements];
  //   newReimbursements[index].checked = checked;
  //   setFormData({
  //     ...formData,
  //     reimbursements: newReimbursements,
  //   });
  // };

  // Function to add a new reimbursement when a checkbox is checked
  // const handleReimbursementCheckbox = (index, checked) => {
  //   const newReimbursements = [...formData.reimbursements];
    
  //   if (checked) {
  //     // Add a new reimbursement entry
  //     newReimbursements.push({ name: '', amount: 0 });
  //   } else {
  //     // Remove the corresponding reimbursement if unchecked
  //     newReimbursements.splice(index, 1);
  //   }

  //   setFormData({
  //     ...formData,
  //     reimbursements: newReimbursements,
  //   });
  // };

  // // Function to update the name and amount for a specific reimbursement
  // const handleReimbursementChange = (index, field, value) => {
  //   const newReimbursements = [...formData.reimbursements];
  //   newReimbursements[index][field] = value;
  //   setFormData({
  //     ...formData,
  //     reimbursements: newReimbursements,
  //   });
  // };

  useEffect(() => {
    const grossPay = 36000; 
    const basic = calculateBasic(formData.basic_percentage, grossPay);
    const hra = calculateHRA(basic, formData.hra_percentage);
    const da = calculateDA(formData.da_percentage, grossPay);
    let eePF = 0;
    if (formData.pf) {
      if (formData.pf_type === '15k') {
        eePF = Math.round(basic > 15000 ? 15000 * 0.12 : basic * 0.12);
      } else if (formData.pf_type === '!=15k') {
        eePF = Math.round(basic * 0.12);
      }
    }   
    // const pf = eePF ;
    
    const variablePay = formData.variable_pay ? 3000 : 0;  
    const quarterlyAllowance = formData.quarterly_allowance ? 2000 : 0;  
    const quarterlyBonus = formData.quarterly_bonus ? 1000 : 0;  
    const annualBonus = formData.annual_bonus ? 5000 : 0;  
    // const specialAllowance = formData.special_allowances ? 6000 : 0;  
    const specialAllowance = grossPay - (basic + da + hra + variablePay + quarterlyAllowance + quarterlyBonus + annualBonus) ;
    const totalEarnings = basic + da + hra + variablePay + quarterlyAllowance + quarterlyBonus + annualBonus + specialAllowance;
  
    
    const totalDeductions = calculateDeductions(formData, basic);
    
    setTotals({
      basic: basic,
      hra: hra,
      da: da, 
      variablePay: variablePay,
      quarterlyAllowance: quarterlyAllowance,
      quarterlyBonus: quarterlyBonus,
      annualBonus: annualBonus,
      specialAllowance: specialAllowance,
      providentFund: formData.pf ? eePF : 0,  
      professionalTax: formData.professional_tax ? 200 : 0,  
      totalEarnings: totalEarnings,
      totalDeductions: totalDeductions,
      netAmount: totalEarnings - totalDeductions,

    });
  }, [formData, calculateDeductions]);
  

  const navigate = useNavigate();
  const companyId = localStorage.getItem('companyId');


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post('http://localhost:8000/payroledetails/', {
  //       ...formData,
  //       company: companyId,  // Include companyId in the data
  //     });
  //     if (response.status === 201) {
  //       // Handle success
  //       console.log('Data successfully submitted:', response.data);
  //      // Redirect to EmployeeSetup
  //         navigate('/employeesetup'); 
        
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error.response?.data || error.message);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   try {
  //     const response = await axios.post('http://localhost:8000/payroledetails/', {
  //       ...formData,
  //       company: companyId,
  //     });
  
  //     if (response.status === 201) {
  //       // Pass selected checkboxes (e.g., advances, variable_pay) to Employee Setup page
  //       const selectedOptions = {
  //         advances: formData.advances,
  //         variable_pay: formData.variable_pay,
  //         // Add other checkboxes as required...
  //       };
  
  //       // Navigate to Employee Setup and pass selected options via state
  //       navigate('/employeesetup', { state: { selectedOptions } });
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error.response?.data || error.message);
  //   }
  // };

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
      // advances: formData.advances,
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

    // Store data in localStorage
    localStorage.setItem('payrollData', JSON.stringify(dataToStore));
    console.log('Data stored in localStorage:', dataToStore);  

    try {
      const response = await axios.post('http://localhost:8000/api/payroledetails/', {
        ...formData,
        company: companyId,  // Include companyId in the data
      });
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
              <span className="percentage-symbol">% of Monthaly Pay</span>
            </div>

            {/* <div className="form-group">
              <label>DA Percentage:</label>
              <input
                type="number"
                name="da_percentage"
                value={formData.da_percentage}
                onChange={handleChange}
                required
              />
              <span className="percentage-symbol">% of Monthaly Pay</span>
            </div> */}

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

            {formData.da_enabled && (
              <div className="form-group">
                <label>DA Percentage:</label>
                <input
                  type="number"
                  name="da_percentage"
                  value={formData.da_percentage}
                  onChange={handleChange}
                  required
                />
                <span className="percentage-symbol">% of Monthly Pay</span>
              </div>
            )}
  
            <div className="form-group">
              <label>HRA Percentage:</label>
              <input id='HRAP'
                type="number"
                name="hra_percentage"
                value={formData.hra_percentage}
                onChange={handleChange}
                required
              />
              <span className="percentage-symbol">% of Basic Pay</span>
            </div>
  
            <div className="form-group">
              <label>Variable Pay:</label>
              <input
                type="checkbox"
                checked={formData.variable_pay}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    variable_pay: !prev.variable_pay,
                  }))
                }
              />
            </div>
  
            {formData.variable_pay && (
              <>
                <div className="form-group">
                  <label>Quarterly Allowance:</label>
                  <input
                    type="checkbox"
                    checked={formData.quarterly_allowance}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        quarterly_allowance: !prev.quarterly_allowance,
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Quarterly Bonus:</label>
                  <input
                    type="checkbox"
                    checked={formData.quarterly_bonus}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        quarterly_bonus: !prev.quarterly_bonus,
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Annual Bonus:</label>
                  <input
                    type="checkbox"
                    checked={formData.annual_bonus}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        annual_bonus: !prev.annual_bonus,
                      }))
                    }
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

            {/* <h3>Reimbursements</h3>
            {formData.reimbursements.map((reimbursement, index) => (
              <div key={index} className="form-group">
                <label>Reimbursement {index + 1}</label>
                <input
                  type="checkbox"
                  checked={!!formData.reimbursements[index]}
                  onChange={(e) => handleReimbursementCheckbox(index, e.target.checked)}
                />

        
                {formData.reimbursements[index] && (
                  <>
                
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label>Name:</label>
                        <input
                          type="text"
                          value={reimbursement.name}
                          onChange={(e) => handleReimbursementChange(index, 'name', e.target.value)}
                        />
                      </div>

      
                      <div style={{ flex: 1 }}>
                        <label>Amount:</label>
                        <input
                          type="number"
                          value={reimbursement.amount}
                          onChange={(e) => handleReimbursementChange(index, 'amount', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))} */}

            {/* <button type="button" onClick={() => handleReimbursementCheckbox(formData.reimbursements.length, true)}>
              + Add Reimbursement
            </button> */}
  
            <h3>Deductions</h3>
            {/* <div className="form-group">
              <label>Advances:</label>
              <input
                type="checkbox"
                name="advances"
                checked={formData.advances}
                onChange={handleChange}
              />
            </div> */}
  
           
  
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

            {/* {formData.pf && (formData.pf_type === "15k" || formData.pf_type === "Both") &&  (
              <div className="form-group">
                <label>Voluntary Provident Fund:</label>
                <select
                  name="voluntary_pf"
                  value={formData.voluntary_pf}
                  onChange={handleChange}
                >
                  <option value="">Select option</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            )} */}

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
            <table>
              <thead>
                <tr>
                  <th>Earnings</th>
                  <th></th>
                  <th>Deductions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td>{totals.basic} Rs</td>
                  <td>Provident Fund (PF)</td>
                  <td>{totals.providentFund} Rs</td>
                </tr>
                <tr>
                  <td>Dearness Allowance (DA)</td>
                  <td>{totals.da} Rs</td>  {/* New DA row */}
                  <td>Professional Tax</td>
                  <td>{totals.professionalTax} Rs</td>
                </tr>
                <tr>
                  <td>House Rent Allowance (HRA)</td>
                  <td>{totals.hra} Rs</td>
                  {/* <td>Advances</td>
                  <td>{formData.advances ? 500 : 0} Rs</td> */}
                  <td>ESI</td>
                  <td>{formData.esi ? 500 : 0} Rs</td>
                </tr>
                <tr>
                  <td>Special Allowance</td>
                  <td>{totals.specialAllowance} Rs</td>
                  <td>Deductions & Loans</td>
                  <td>{formData.deductions ? 1000 : 0} Rs</td>
                </tr>
                <tr>
                  <td>Variable Pay</td>
                  <td>{totals.variablePay} Rs</td>
                  <td>Voluntary Provident Fund</td>
                  <td>{formData.voluntary_pf ? (totals.providentFund) : 0} Rs</td>  
                </tr>
                <tr>
                  <td>Quarterly Allowance</td>
                  <td>{totals.quarterlyAllowance} Rs</td>
                  <td></td>
                  <td></td> 
                </tr>
                <tr>
                  <td>Quarterly Bonus</td>
                  <td>{totals.quarterlyBonus} Rs</td>
                  <td></td>
                  <td></td> 
                </tr>
                <tr>
                  <td>Annual Bonus</td>
                  <td>{totals.annualBonus} Rs</td>
                  <td></td>
                  <td></td>
                </tr>
              
                <tr className="total-row">
                  <td>Total Earnings (Gross Pay)</td>
                  <td>{totals.totalEarnings} Rs</td>
                  <td>Total Deductions</td>
                  <td>{totals.totalDeductions} Rs</td>
                </tr>
                <tr className="total-row">
                  <td colSpan="2">Net Amount Paid</td>
                  <td colSpan="2">{totals.netAmount} Rs</td>
                </tr>
              </tbody>
            </table>
            <div className="ctc-info">
                  **Gross Pay = 36000
            </div>
        </div>
      </div>
    </div>
  );
  };
  
  export default PayroleSetup;
  

  