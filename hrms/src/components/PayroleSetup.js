import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; 
import './PayroleSetup.css'; 
import { useNavigate } from 'react-router-dom';

const PayroleSetup = () => {
  const [formData, setFormData] = useState({
    basic_percentage: '',
    hra_percentage: '',
    advances: false,
    variable_pay: false,
    deductions: false,
    gratuity: false,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      <Navbar />  {/* Add Navbar here */}
      <h2>Employee Compensation Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="payrole-form-container">
          <div className="form-group">
            <label>Basic Percentage:</label>
            <input
              type="number"
              name="basic_percentage"
              value={formData.basic_percentage}
              onChange={handleChange}
              required
            />
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
          </div>

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
            <label>Variable Pay:</label>
            <input
              type="checkbox"
              name="variable_pay"
              checked={formData.variable_pay}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Deductions:</label>
            <input
              type="checkbox"
              name="deductions"
              checked={formData.deductions}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Gratuity:</label>
            <input
              type="checkbox"
              name="gratuity"
              checked={formData.gratuity}
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
            <label>ESI:</label>
            <input
              type="checkbox"
              name="esi"
              checked={formData.esi}
              onChange={handleChange}
            />
          </div>

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
          )}

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
                <option value=">15k">Greater than 15k</option>
                <option value="<=15k">Less than or equal to 15k</option>
                <option value="vpf">Voluntary Provident Fund</option>
              </select>
            </div>
          )}

          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PayroleSetup;
