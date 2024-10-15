import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; 
import './PayroleSetup.css'; 
import { useNavigate } from 'react-router-dom';

const PayroleSetup = () => {
  const [formData, setFormData] = useState({
    basic_percentage: '50',
    hra_percentage: '20',
    advances: false,
    variable_pay: false,
    deductions: false,
    // gratuity: false,
    quarterly_allowance: false,
    quarterly_bonus: false,
    annual_bonus: false,
    special_allowances: false,
    professional_tax: false,
    esi: false,
    esi_percentage: '',
    pf: false,
    pf_type: '',
  });

  const [totals, setTotals] = useState({
    basic: 12500,
    hra: 2500,
    internet: 1000,
    special_allowance: 6000,
    totalEarnings: 0,
    providentFund: 1680,
    professionalTax: 200,
    totalDeductions: 0,
    netAmount: 0,
  });

  const calculateBasic = (percentage) => 12500 * (percentage / 100);
  const calculateHRA = (percentage) => 2500 * (percentage / 100);
  const calculateDeductions = (formData) => {
    let deductions = 0;
    if (formData.professional_tax) deductions += 200;
    if (formData.pf) deductions += 1680;
    return deductions;
  };

  // Recalculate totals whenever form data changes
  useEffect(() => {
    const basic = formData.basic_percentage ? calculateBasic(formData.basic_percentage) : 12500;
    const hra = formData.hra_percentage ? calculateHRA(formData.hra_percentage) : 2500;
    const totalEarnings = basic + hra + totals.internet + totals.special_allowance;
    const totalDeductions = calculateDeductions(formData);

    setTotals({
      ...totals,
      basic: basic,
      hra: hra,
      totalEarnings: totalEarnings,
      totalDeductions: totalDeductions,
      netAmount: totalEarnings - totalDeductions,
    });
  }, [formData, totals]);

  const navigate = useNavigate();
  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    // You can fetch and prefill data if needed
  }, []);

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
    // const formDataToSend = new FormData();
    console.log('Form submitted'); // Debugging log
  
    // Prepare data to store in localStorage
    const dataToStore = {
      basic_percentage: formData.basic_percentage,
      hra_percentage: formData.hra_percentage,
      advances: formData.advances,
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
    };

    // Store data in localStorage
    localStorage.setItem('payrollData', JSON.stringify(dataToStore));
    console.log('Data stored in localStorage:', dataToStore);
    

    try {
      const response = await axios.post('http://localhost:8000/payroledetails/', {
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
              <span className="percentage-symbol">%</span>
            </div>
  
            <div className="form-group">
              <label>HRA Percentage:</label>
              <input
                type="number"
                name="hra_percentage"
                value={formData.hra_percentage}
                onChange={handleChange}
                required
              />
              <span className="percentage-symbol">%</span>
            </div>
  
            <div className="form-group">
              <label>Variable Pay:</label>
              <input
                type="checkbox"
                name="variable_pay"
                checked={formData.variable_pay}
                onChange={handleChange}
              />
            </div>
  
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
            {/* <div className="form-group">
              <label>Gratuity:</label>
              <input
                type="checkbox"
                name="gratuity"
                checked={formData.gratuity}
                onChange={handleChange}
              />
            </div> */}
            <div className="form-group">
              <label>Advances:</label>
              <input
                type="checkbox"
                name="advances"
                checked={formData.advances}
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
                  <option value="">Select PF Type</option>
                  <option value=">15k">Wage limit 15k</option>
                  <option value="<=15k">Not applicable</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            )}

            {formData.pf && formData.pf_type === ">15k" &&  (
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
            {/*             
            {formData.esi && (
              <div className="form-group">
                <label>ESI Percentage:</label>
                <select
                  name="esi_percentage"
                  value={formData.esi_percentage}
                  onChange={handleChange}
                >
                  <option value="">Select ESI Percentage</option>
                  <option value="0.75">0.75% of Monthly Pay</option>
                  <option value="3.25">3.25% of Monthly Pay</option>
                </select>
              </div>
            )} */}
  
            <div className="form-group">
              <label>Deductibles & Loans:</label>
              <input
                type="checkbox"
                name="deductions"
                checked={formData.deductions}
                onChange={handleChange}
              />
            </div>
  
            <button type="submit">Submit</button>
          </div>
        </form>
  
        <div className="table-container">
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
                <td>Basic</td>
                <td>{totals.basic} Rs</td>
                <td>Provident Fund</td>
                <td>{totals.providentFund} Rs</td>
              </tr>
              <tr>
                <td>House Rental Allowance</td>
                <td>{totals.hra} Rs</td>
                <td>Professional Tax</td>
                <td>{formData.professional_tax ? totals.professionalTax : 0} Rs</td>
              </tr>
              <tr>
                <td>Internet & Telephone Allowance</td>
                <td>{totals.internet} Rs</td>
                <td>Income Tax</td>
                <td>0 Rs</td>
              </tr>
              <tr>
                <td>Special Allowance</td>
                <td>{totals.special_allowance} Rs</td>
                <td>Deductions & Loans</td>
                <td>0 Rs</td>
              </tr>
              <tr className="total-row">
                <td>Total (Rs)</td>
                <td>{totals.totalEarnings} Rs</td>
                <td>Total (Rs)</td>
                <td>{totals.totalDeductions} Rs</td>
              </tr>
              <tr className="total-row">
                <td colSpan="2">Net Amount Paid</td>
                <td colSpan="2">{totals.netAmount} Rs</td>
              </tr>
            </tbody>
          </table>
          <div className="ctc-info">
                **CTC = 3 LPA
          </div>
        </div>
      </div>
    </div>
  );
  };
  
  export default PayroleSetup;
  

  