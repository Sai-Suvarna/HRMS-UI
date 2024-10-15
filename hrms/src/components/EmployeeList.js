import { Tabs, Form, Input, Button, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css'; // Ensure this is correctly linked
import Navbar from './Navbar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const { TabPane } = Tabs;



const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [empId, setEmpId] = useState(''); // Initialize useState hooks
  const [lop, setLop] = useState('');
  const [ot, setOt] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8000/employee/');
        setEmployees(response.data.employees);
      } catch (err) {
        setError('Error fetching employees');
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddNewEmployee = () => {
    navigate('/employeesetup'); // Adjust the path if needed
  };

  if (error) {
    return <div>{error}</div>;
  }

  // Handler for submitting the form
  const handleCalculateSubmit = () => {
    console.log("Emp ID:", empId, "LOP:", lop, "OT:", ot);
    form.resetFields();
  };

  const exportPDF = () => {
    const input = document.getElementById('payslip-table'); // Get the table element
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('payslip.pdf'); // Save as 'payslip.pdf'
      })
      .catch((err) => console.log(err));
  };



  return (
    <div>
      <Navbar /> {/* Add Navbar here */}

      <Tabs defaultActiveKey="1">
        {/* First Tab - Employee List */}
        <TabPane tab="Employee List" key="1">
          <h2>Employee List</h2>
          <button onClick={handleAddNewEmployee} className="add-button">
            Add New Employee
          </button>
          <div className="container">
            <table>
              <thead>
                <tr>
                  <th>Emp ID</th>
                  <th>Work Details</th>
                  {/* <th>Name</th>
                  <th>Department</th>
                  <th>Role</th> */}
                  <th>Social Security</th>
                  <th>Personal Details</th>
                  <th>Insurance Details</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.work_details.wdId}>

                    <td>{employee.work_details.empId}</td>

                    <td>
                      <div>Name: {employee.work_details.firstName} {employee.work_details.lastName}</div>
                      <div>Employment Status{employee.work_details.employmentStatus}</div>
                      <div>Comapny Email Id{employee.work_details.companyEmailId}</div>
                      <div>Date of Joining{employee.work_details.dateOfJoining}</div>
                      <div>Date of Relieving{employee.work_details.dateOfRelieving}</div>
                      <div>Department: {employee.work_details.department}</div>
                      <div>Group{employee.work_details.group}</div>
                      <div>Role Type{employee.work_details.roleType}</div>
                      <div>Current Role{employee.work_details.currentRole}</div>
                      <div>Reporting Manager{employee.work_details.reportingManager}</div>
                      <div>Reason for leaving: {employee.work_details.reasonForLeaving}</div>
                      <div>Month and Year Of Termination: {employee.work_details.monthYearOfTermination}</div>
                      <div>Total exp in this Company: {employee.work_details.totalExpInThisCompany}</div>
                      <div> total exp before joining: {employee.work_details.totalExpBeforeJoining}</div>
                      <div>Total Experience: {employee.work_details.totalExperience}</div>
                      <div>Previous Date Of Joining: {employee.work_details.previousDateOfJoining}</div>
                      <div>Previous Employer: {employee.work_details.previousEmployer}</div>

                      
                    </td>
                    
                    <td>
                      <div>PAN: {employee.social_security_details.panNum}</div>
                      <div>UAN: {employee.social_security_details.uanNum}</div>
                      <div>Aadhar: {employee.social_security_details.aadharNum}</div>
                      <div>Bank Name: {employee.social_security_details.bankName}</div>
                      <div>IFSC Code: {employee.social_security_details.ifscCode}</div>
                      <div>Bank Account Number: {employee.social_security_details.bankAccountNumber}</div>
                    </td>
                    <td>
                      <div>Personal Email Id: {employee.personal_details.personalEmailId}</div>
                      <div>Gender: {employee.personal_details.gender}</div>
                      <div>Educational Qualification: {employee.personal_details.educationalQualification}</div>
                      <div>Marital Status: {employee.personal_details.maritalStatus}</div>
                      <div>Marriage Date: {employee.personal_details.marriageDate}</div>
                      <div>Current Address: {employee.personal_details.currentAddress}</div>
                      <div>Permanent Address: {employee.personal_details.permanentAddress}</div>
                      <div>General Contact: {employee.personal_details.generalContact}</div>
                      <div>Emergency Contact: {employee.personal_details.emergencyContact}</div>
                      <div>Relationship: {employee.personal_details.relationship}</div>
                      <div>Relationship Name: {employee.personal_details.relationshipName}</div>
                      <div>Blood Group: {employee.personal_details.bloodGroup}</div>
                      <div>Shirt Size: {employee.personal_details.shirtSize}</div>

                      <div>Address: {employee.personal_details.currentAddress}</div>
                    </td>
                    <td>
                      <div>Father's Name: {employee.insurance_details.fathersName}</div>
                      <div>Father's DOB: {employee.insurance_details.fathersDOB}</div>
                      <div>Mother's Name: {employee.insurance_details.mothersName}</div>
                      <div>Mother's DOB: {employee.insurance_details.mothersDOB}</div>
                      <div>Spouse Name: {employee.insurance_details.spouseName}</div>
                      <div>Spouse DOB: {employee.insurance_details.spouseDOB}</div>
                      <div>Child1 Name: {employee.insurance_details.child1}</div>
                      <div>Child1 DOB: {employee.insurance_details.child1DOB}</div>
                      <div>Child2 Name: {employee.insurance_details.child2}</div>
                      <div>Child2 DOB: {employee.insurance_details.child2DOB}</div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPane>

        {/* Second Tab - Calculations */}
        {/* <TabPane tab="Calculations" key="2">
          <h3>Calculation for Employee Salary</h3>
          <Form form={form} layout="inline" onFinish={handleCalculateSubmit}>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Employee ID" required>
                  <Input value={empId} onChange={(e) => setEmpId(e.target.value)} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="LOP (Loss of Pay)" required>
                  <Input value={lop} onChange={(e) => setLop(e.target.value)} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="OT (Over Time)" required>
                  <Input value={ot} onChange={(e) => setOt(e.target.value)} />
                </Form.Item>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </TabPane>  */}
        <TabPane tab="Calculations" key="2">
          <h3>Calculation for Employee Salary</h3>
          <Form form={form} layout="inline" onFinish={handleCalculateSubmit}>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Employee ID" required>
                  <Input />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="LOP (Loss of Pay)" required>
                  <Input />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="OT (Over Time)" required>
                  <Input />
                </Form.Item>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>

          {/* Payslip Table */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <table id="payslip-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              {/* Header Section */}
              <thead>
                <tr>
                  <th colSpan="4" style={{ padding: '10px', backgroundColor: '#cde2ff', textAlign: 'center' }}>
                    Solivar Software Development Company Pvt.Ltd
                  </th>
                </tr>
                <tr>
                  <th colSpan="4" style={{ padding: '5px', textAlign: 'center' }}>
                    Plot No. 17&18, Flat No. 301, Vishnu Avenue, Krithika Layout, Jai Hind Enclave, Madhapur, Hyderabad - 500081. Telangana
                  </th>
                </tr>
                <tr>
                  <th colSpan="4" style={{ padding: '10px', backgroundColor: '#e6f7ff', textAlign: 'center' }}>
                    Payslip For The Month OF August 2024
                  </th>
                </tr>
              </thead>

              {/* Employee Information */}
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Employee Code</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>233</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>PF Account No.</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>----</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Name</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Sai Pavan Pilla</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>UAN Number</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>----</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Designation</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Software Engineer - I</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>PAN Number</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>AFTVU4356H</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Department</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Software Development</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Bank Details</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>98346982350234</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Location</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Hyderabad</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Days worked</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>30</td>
                </tr>

                {/* Earnings and Deductions Section */}
                <tr>
                  <th colSpan="2" style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Earnings</th>
                  <th colSpan="2" style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Deductions</th>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Basic</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>14,000 Rs</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Provident Fund</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>1,680 Rs</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>House Rental Allowance</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>7,000 Rs</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Professional Tax</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>200 Rs</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Internet & Telephone Allowance</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>1,000 Rs</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Income Tax</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>0 Rs</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Special Allowance</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>6,000 Rs</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Deductions & Loans</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>0 Rs</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>Bonus & Advances</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>0 Rs</td>
                  <td colSpan="2" style={{ border: '1px solid #ddd', padding: '10px' }}></td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>Total (Rs)</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>28,000 Rs</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>Total (Rs)</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>1,880 Rs</td>
                </tr>
                <tr>
                  <td colSpan="4" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Net Amount Paid: 26,120 Rs</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Button to Export Table as PDF */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button type="primary" onClick={exportPDF}>
              Export as PDF
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EmployeeList;