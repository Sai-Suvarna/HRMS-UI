import React, { useEffect, useState } from 'react'; // Ensure this line is present
import Navbar from './Navbar';
import axios from 'axios';
import { Form, Input, Button, DatePicker, Select, message, Tabs, Divider } from 'antd';
import moment from 'moment';
import './EmployeeSetup.css'; 
import { useNavigate } from 'react-router-dom';


const { Option } = Select;
const { TabPane } = Tabs;

const EmployeeSetup = () => {
  const [form, setFormData] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState('1'); // State to keep track of the active tab
  // const [compensationSettings, setCompensationSettings] = useState({});
  const [payrollSettings, setPayrollSettings] = useState(null);
  const navigate = useNavigate();
  // const fetchCompensationSettings = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/api/payroledetails/'); // Adjust the endpoint as needed
  //     setCompensationSettings(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch compensation settings:', error);
  //   }
  // };

  
  const [grossPay, setGrossPay] = useState('');
  const [specialAllowances, setSpecialAllowances] = useState(0); // For special allowances calculation
  // const [setPfType] = useState(''); // State for selected PF Type
  // const [setProfessionalTax] = useState(0); // State for Professional Tax
  const [pfType, setPfType] = useState(''); // State for selected PF Type
  const [pfValue, setPfValue] = useState(0); // State to store calculated PF value
  const [professionalTax, setProfessionalTax] = useState(0); // State for Professional Tax

  // Fetch payroll settings on component mount
  useEffect(() => {
    const fetchCompensationSettings = async () => {
      try {
        const companyId = localStorage.getItem('companyId');
        if (!companyId) {
          console.error('Company ID not found');
          return;
        }

        const response = await axios.get(`http://localhost:8000/payroll-settings/${companyId}/`);
        console.log('Fetched Payroll Settings:', response.data); // Debug: Check if data is fetched
        setPayrollSettings(response.data); // Store the fetched settings
      } catch (error) {
        console.error('Error fetching payroll settings:', error);
      }
    };

    fetchCompensationSettings();
  }, []);

  // // Handle change for reimbursement inputs
  // const handleChange = (name, value) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     reimbursements: {
  //       ...prevData.reimbursements,
  //       [name]: value,
  //     },
  //   }));
  // };
  // Handle dynamic reimbursement inputs
  const reimbursements = payrollSettings?.reimbursements || {};
  const handleReimbursementChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      salary_details: {
        ...prevData.salary_details,
        reimbursements: {
          ...prevData.salary_details.reimbursements,
          [name]: value, // Store the dynamic key-value pairs
        },
      },
    }));
  };


  // // Handle Gross Pay input and calculate Basic, DA, and HRA dynamically
  // const handleGrossPayChange = (e) => {
  //   const value = parseFloat(e.target.value) || 0;
  //   setGrossPay(value);

  //   if (payrollSettings) {
  //     const basic = (payrollSettings.basic_percentage / 100) * value;
  //     const da = (payrollSettings.da_percentage / 100) * value;
  //     const hra = (payrollSettings.hra_percentage / 100) * value;

  //     // Update form fields dynamically
  //     form.setFieldsValue({
  //       salary_details: {
  //         BasicpayAMT: basic.toFixed(2),
  //         DAPayAMT: da.toFixed(2),
  //         HRApayAMT: hra.toFixed(2),
  //       },
  //     });
  //   }
  // };

  // // Handle changes to Basic Pay
  // const handleBasicPayChange = (e) => {
  //   const value = parseFloat(e.target.value) || 0;
  //   const gross = (value / (payrollSettings.basic_percentage / 100)).toFixed(2);
  //   setGrossPay(gross);
  //   form.setFieldsValue({
  //     salary_details: {
  //       BasicpayAMT: value.toFixed(2),
  //     },
  //   });
  // };

  // // Handle changes to DA Pay
  // const handleDaPayChange = (e) => {
  //   const value = parseFloat(e.target.value) || 0;
  //   const gross = (value / (payrollSettings.da_percentage / 100)).toFixed(2);
  //   setGrossPay(gross);
  //   form.setFieldsValue({
  //     salary_details: {
  //       DAPayAMT: value.toFixed(2),
  //     },
  //   });
  // };

  // // Handle changes to HRA Pay
  // const handleHraPayChange = (e) => {
  //   const value = parseFloat(e.target.value) || 0;
  //   const gross = (value / (payrollSettings.hra_percentage / 100)).toFixed(2);
  //   setGrossPay(gross);
  //   form.setFieldsValue({
  //     salary_details: {
  //       HRApayAMT: value.toFixed(2),
  //     },
  //   });
  // };




  // const fetchCompensationSettings = async () => {
  //   try {
  //     const companyId = localStorage.getItem('companyId');
  //     if (!companyId) {
  //       console.error('Company ID not found');
  //       return;
  //     }

  //     const response = await axios.get(`http://localhost:8000/payroll-settings/${companyId}/`);
  //     setPayrollSettings(response.data);  // Store the payroll settings in state
  //   } catch (error) {
  //     console.error('Error fetching payroll settings:', error);
  //   }
  // };

  // Handle Gross Pay input and calculate Basic, DA, and HRA dynamically
  const handleGrossPayChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setGrossPay(value);

    if (payrollSettings) {
      const basic = (payrollSettings.basic_percentage / 100) * value;
      const da = (payrollSettings.da_percentage / 100) * value;
      const hra = (payrollSettings.hra_percentage / 100) * basic;

      // Update form fields dynamically
      form.setFieldsValue({
        salary_details: {
          BasicpayAMT: basic.toFixed(2),
          DApayAMT: da.toFixed(2),
          HRApayAMT: hra.toFixed(2),
        },
      });
      
      calculateSpecialAllowances(value, basic, da, hra);

      // Calculate Professional Tax
      calculateProfessionalTax(value);

      // Calculate PF based on PF type
      if (payrollSettings.pf) {
        const pfType = form.getFieldValue(['salary_details', 'pfType']) || payrollSettings.pf_type;
        calculatePF(pfType, basic); // No need to pass grossPay
      }
    }
  };

  // Calculate special allowances
  const calculateSpecialAllowances = (grossPay, basic, da, hra) => {
    // Initialize sum1 with basic, DA, and HRA
    let sum1 = parseFloat(basic) + parseFloat(da) + parseFloat(hra);

    // // Add other allowances if they exist
    // if (payrollSettings?.variable_pay) {
    //   const variablePay = form.getFieldValue('salary_details.variablePayAMT') || 0;
    //   sum1 += parseFloat(variablePay);
    // }

    // if (payrollSettings?.quarterly_allowance) {
    //   const quarterlyAllowance = form.getFieldValue('salary_details.QAllowanceAMT') || 0;
    //   sum1 += parseFloat(quarterlyAllowance);
    // }

    // if (payrollSettings?.quarterly_bonus) {
    //   const quarterlyBonus = form.getFieldValue('salary_details.QBonusAMT') || 0;
    //   sum1 += parseFloat(quarterlyBonus);
    // }

    // if (payrollSettings?.annual_bonus) {
    //   const annualBonus = form.getFieldValue('salary_details.ABonusAMT') || 0;
    //   sum1 += parseFloat(annualBonus);
    // }

    // Add reimbursements
    if (payrollSettings?.reimbursements) {
      Object.values(payrollSettings.reimbursements).forEach((amount) => {
        sum1 += parseFloat(amount);
      });
    }

    // Calculate special allowances
    const calculatedSpecialAllowance = (grossPay - sum1).toFixed(2);
    setSpecialAllowances(calculatedSpecialAllowance);
    form.setFieldsValue({
      salary_details: {
        SAllowancesAMT: calculatedSpecialAllowance,
      },
    });
  };
  // Handle changes to PF Type selection
  const handlePfTypeChange = (value) => {
    setPfType(value);
    calculatePF(grossPay, value);
  };
  
  // Calculate PF based on PF type and gross pay
  const calculatePF = (pfType, basicPay) => {
    let pfAmount;

    if (pfType === '15k') {
      pfAmount = 15000 * 0.12; // 15k * 12%
    } else if (pfType === '!=15k') {
      pfAmount = basicPay * 0.12; // Basic Pay * 12%
    } else {
      pfAmount = 0; // Handle edge cases or defaults
    }

    // Update PF field with calculated value
    form.setFieldsValue({
      salary_details: {
        PFAMT: pfAmount.toFixed(2),
      },
    });
  };
  
  // Function to calculate Professional Tax based on Gross Pay
  const calculateProfessionalTax = (grossPay) => {
    let calculatedPT = 0;

    if (grossPay > 20000) {
        calculatedPT = 200;
    } else if (grossPay > 15000) {
        calculatedPT = 150;
    }

    setProfessionalTax(calculatedPT); // Store calculated Professional Tax

    // Update the form field for Professional Tax
    form.setFieldsValue({
        salary_details: {
            PTAMT: calculatedPT,
        },
    });
  };
 
  // Handle changes to Basic Pay
  const handleBasicPayChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const gross = (value / (payrollSettings.basic_percentage / 100)).toFixed(2);
    setGrossPay(gross);
    form.setFieldsValue({
      salary_details: {
        BasicpayAMT: value.toFixed(2),
      },
    });
    
    // Recalculate allowances after updating basic pay
    // calculateDynamicValues(gross, value);
  };

  // Handle changes to DA Pay
  const handleDaPayChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const gross = (value / (payrollSettings.da_percentage / 100)).toFixed(2);
    setGrossPay(gross);
    form.setFieldsValue({
      salary_details: {
        DApayAMT: value.toFixed(2),
      },
    });

    // Recalculate allowances after updating DA pay
    // calculateDynamicValues(gross, null, value);
  };

  // Handle changes to HRA Pay
  const handleHraPayChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const gross = (value / (payrollSettings.hra_percentage / 100)).toFixed(2);
    setGrossPay(gross);
    form.setFieldsValue({
      salary_details: {
        HRApayAMT: value.toFixed(2),
      },
    });

    // Recalculate allowances after updating HRA pay
    // calculateDynamicValues(gross, null, null, value);
  };

  // Recalculate values when any salary component is updated
  // const calculateDynamicValues = (gross, basic = null, da = null, hra = null) => {
  //   if (payrollSettings) {
  //     const updatedGrossPay = gross ? parseFloat(gross) : parseFloat(form.getFieldValue('salary_details.CTCpayAMT')) || 0;

  //     const newBasic = basic !== null ? basic : parseFloat(form.getFieldValue('salary_details.BasicpayAMT')) || 0;
  //     const newDA = da !== null ? da : parseFloat(form.getFieldValue('salary_details.DAPayAMT')) || 0;
  //     const newHRA = hra !== null ? hra : parseFloat(form.getFieldValue('salary_details.HRApayAMT')) || 0;

  //     // Calculate special allowances with updated values
  //     calculateSpecialAllowances(updatedGrossPay, newBasic, newDA, newHRA);
  //   }
  // };

  const nextTab = () => {
    const nextKey = (parseInt(activeTabKey) + 1).toString();
    setActiveTabKey(nextKey);
  };

  const prevTab = () => {
    const prevKey = (parseInt(activeTabKey) - 1).toString();
    setActiveTabKey(prevKey);
  };
  
  // useEffect(() => {
  //   fetchCompensationSettings();
  // }, []);

  const handleTabChange = (key) => {
    setActiveTabKey(key); // Update the active tab key
  };

  const handleSubmit = async () => {
    try {
      // Get the company_id from localStorage
      const company_id = localStorage.getItem('companyId');
      if (!company_id) {
          console.error('Company ID not found');
          return;
      }
      // Format date fields
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        company: company_id,  // Include company_id in form data
        work_details: {
          ...values.work_details,
          dateOfJoining: values.work_details.dateOfJoining ? moment(values.work_details.dateOfJoining).format('YYYY-MM-DD') : null,
          dateOfRelieving: values.work_details.dateOfRelieving ? moment(values.work_details.dateOfRelieving).format('YYYY-MM-DD') : null,
          previousDateOfJoining: values.work_details.previousDateOfJoining ? moment(values.work_details.previousDateOfJoining).format('YYYY-MM-DD') : null,
        },
        personal_details: {
          ...values.personal_details,
          dob: values.personal_details.dob ? moment(values.personal_details.dob).format('YYYY-MM-DD') : null,
          marriageDate: values.personal_details.marriageDate ? moment(values.personal_details.marriageDate).format('YYYY-MM-DD') : null,
        },
        insurance_details: {
          ...values.insurance_details,
          fathersDOB: values.insurance_details.fathersDOB ? moment(values.insurance_details.fathersDOB).format('YYYY-MM-DD') : null,
          mothersDOB: values.insurance_details.mothersDOB ? moment(values.insurance_details.mothersDOB).format('YYYY-MM-DD') : null,
          spouseDOB: values.insurance_details.spouseDOB ? moment(values.insurance_details.spouseDOB).format('YYYY-MM-DD') : null,
          child1DOB: values.insurance_details.child1DOB ? moment(values.insurance_details.child1DOB).format('YYYY-MM-DD') : null,
          child2DOB: values.insurance_details.child2DOB ? moment(values.insurance_details.child2DOB).format('YYYY-MM-DD') : null,
        },
        salary_details: {
          ...values.salary_details,
          reimbursements: reimbursements, // Ensure reimbursements are included
        },
      };
       
      console.log('Payload:', formattedValues); // Verify the payload structure

      formattedValues.salary_details.reimbursements = Object.fromEntries(
        Object.entries(formattedValues.salary_details.reimbursements).filter(([key, value]) => key && value)
      );

      // Make the API request to save employee data
      await axios.post('http://localhost:8000/api/employee/', formattedValues);

      message.success('Employee details submitted successfully');
      form.resetFields(); // Optionally reset the form fields after submission
           // Redirect to EmployeeSetup
           navigate('/employeelist'); 
    } catch (error) {
      console.error('Submission error:', error);
      message.error('Failed to submit employee details');
    }
  };

  return (
    <div>
    <Navbar />  {/* Add Navbar here */}

    <div className="employee-setup">
      <div>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
            <TabPane tab="Work Details" key="1">
              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="Employee ID" name={['work_details', 'empId']} rules={[{ required: true, message: 'Please enter employee ID' }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Employment Status" name={['work_details', 'employmentStatus']} rules={[{ required: true, message: 'Please select employment status' }]}>
                    <Select>
                      <Option value="active">Active</Option>
                      <Option value="inactive">Inactive</Option>
                      <Option value="terminated">Terminated</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Company Email ID" name={['work_details', 'companyEmailId']} rules={[{ required: true, message: 'Please enter company email ID' }]}>
                    <Input type="email" />
                  </Form.Item>
                </div>
                </div>

                <div className="form-row">

               
                <div className="form-col">
                  <Form.Item label="First Name" name={['work_details', 'firstName']} rules={[{ required: true, message: 'Please enter first name' }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Last Name" name={['work_details', 'lastName']} rules={[{ required: true, message: 'Please enter last name' }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Group" name={['work_details', 'group']}>
                    <Input />
                  </Form.Item>
                </div>
                </div>
                
              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="Department" name={['work_details', 'department']} rules={[{ required: true, message: 'Please enter department' }]}>
                    <Input />
                  </Form.Item>
                </div>

                <div className="form-col">
                  <Form.Item label="Role Type" name={['work_details', 'roleType']} rules={[{ required: true, message: 'Please enter role type' }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Current Role" name={['work_details', 'currentRole']} rules={[{ required: true, message: 'Please enter current role' }]}>
                    <Input />
                  </Form.Item>
                </div>
                </div>
                <div className="form-row">

                <div className="form-col">
                  <Form.Item label="Reporting Manager" name={['work_details', 'reportingManager']} rules={[{ required: true, message: 'Please enter reporting manager' }]}>
                    <Input />
                  </Form.Item>
                </div>
             

                <div className="form-col">
                  <Form.Item label="Reason for Leaving" name={['work_details', 'reasonForLeaving']}>
                    <Input.TextArea />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Month/Year of Termination" name={['work_details', 'monthYearOfTermination']}>
                    <Input />
                  </Form.Item>
                </div>
                </div>
                <div className="form-row">

                <div className="form-col">
                  <Form.Item label="Total Experience in This Company" name={['work_details', 'totalExpInThisCompany']}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Total Experience" name={['work_details', 'totalExperience']}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Total Experience Before Joining" name={['work_details', 'totalExpBeforeJoining']}>
                    <Input />
                  </Form.Item>
                </div>
                </div>
                <div className="form-row">

                <div className="form-col">
                  <Form.Item label="Date of Joining" name={['work_details', 'dateOfJoining']} rules={[{ required: true, message: 'Please select date of joining' }]}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Date of Relieving" name={['work_details', 'dateOfRelieving']}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
           

                <div className="form-col">
                  <Form.Item label="Previous Date of Joining" name={['work_details', 'previousDateOfJoining']}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Previous Employer" name={['work_details', 'previousEmployer']}>
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </TabPane>

            <TabPane tab="Social Security Details" key="2">
              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="PAN Number" name={['social_security_details', 'panNum']} rules={[{ required: true, message: 'Please enter PAN number' }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="IFSC Code" name={['social_security_details', 'ifscCode']} rules={[{ required: true, message: 'Please enter IFSC code' }]}>
                    <Input />
                  </Form.Item>
                </div>
                </div>
                <div className="form-row">

                <div className="form-col">
                  <Form.Item label="Aadhar Number" name={['social_security_details', 'aadharNum']} rules={[{ required: true, message: 'Please enter Aadhar number' }]}>
                    <Input />
                  </Form.Item>
                </div>

                <div className="form-col">
                  <Form.Item label="Bank Name" name={['social_security_details', 'bankName']} rules={[{ required: true, message: 'Please enter bank name' }]}>
                    <Input />
                  </Form.Item>
                </div>
                </div>
                <div className="form-row">

                <div className="form-col">
                  <Form.Item label="UAN Number" name={['social_security_details', 'uanNum']} rules={[{ required: true, message: 'Please enter UAN number' }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Bank Account Number" name={['social_security_details', 'bankAccountNumber']} rules={[{ required: true, message: 'Please enter bank account number' }]}>
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </TabPane>

            <TabPane tab="Personal Details" key="3">
              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="Personal Email ID" name={['personal_details', 'personalEmailId']} rules={[{ required: true, message: 'Please enter personal email ID' }]}>
                    <Input type="email" />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Date of Birth" name={['personal_details', 'dob']} rules={[{ required: true, message: 'Please select date of birth' }]}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Gender" name={['personal_details', 'gender']} rules={[{ required: true, message: 'Please select gender' }]}>
                    <Select>
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="Educational Qualification" name={['personal_details', 'educationalQualification']} rules={[{ required: true, message: 'Please enter educational qualification' }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Marital Status" name={['personal_details', 'maritalStatus']} rules={[{ required: true, message: 'Please select marital status' }]}>
                    <Select>
                      <Option value="single">Single</Option>
                      <Option value="married">Married</Option>
                      <Option value="divorced">Divorced</Option>
                      <Option value="widowed">Widowed</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Marriage Date" name={['personal_details', 'marriageDate']}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
              </div>

              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="Current Address" name={['personal_details', 'currentAddress']} rules={[{ required: true, message: 'Please enter current address' }]}>
                    <Input.TextArea />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Permanent Address" name={['personal_details', 'permanentAddress']} rules={[{ required: true, message: 'Please enter permanent address' }]}>
                    <Input.TextArea />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="General Contact" name={['personal_details', 'generalContact']} rules={[{ required: true, message: 'Please enter Phone number' }]}>
                  <Input />
                  </Form.Item>
                </div>
              </div>

              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="Emergency Contact" name={['personal_details', 'emergencyContact']} rules={[{ required: true, message: 'Please enter emergency phone number' }]}>
                  <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Relationship" name={['personal_details', 'relationship']} rules={[{ required: true, message: 'Please enter relationship' }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Relationship Name" name={['personal_details', 'relationshipName']} rules={[{ required: true, message: 'Please enter relationship name' }]}>
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="Blood Group" name={['personal_details', 'bloodGroup']} rules={[{ required: true, message: 'Please enter blood group' }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Shirt Size" name={['personal_details', 'shirtSize']}>
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </TabPane>

            <TabPane tab="Insurance Details" key="4">
              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="Father’s Name" name={['insurance_details', 'fathersName']}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Father’s DOB" name={['insurance_details', 'fathersDOB']}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
                </div>
                <div className="form-row">

                <div className="form-col">
                  <Form.Item label="Mother’s Name" name={['insurance_details', 'mothersName']}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Mother’s DOB" name={['insurance_details', 'mothersDOB']}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
                </div>
                <div className="form-row">

                <div className="form-col">
                  <Form.Item label="Spouse Name" name={['insurance_details', 'spouseName']}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Spouse DOB" name={['insurance_details', 'spouseDOB']}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
                </div>
                <div className="form-row">

                <div className="form-col">
                  <Form.Item label="Child 1 Name" name={['insurance_details', 'child1']}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Child 1 DOB" name={['insurance_details', 'child1DOB']}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
                </div>
                <div className="form-row">

                <div className="form-col">
                  <Form.Item label="Child 2 Name" name={['insurance_details', 'child2']}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item label="Child 2 DOB" name={['insurance_details', 'child2DOB']}>
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </div>
              </div>
            </TabPane>

              <TabPane tab="Salary details" key="5">
                {/* <div className="form-row">
                  <div className="form-col">
                    <Form.Item label="Employee Gross Pay" name={['salary_details', 'CTCpayAMT']} rules={[{ required: true, message: 'Please enter Employee CTC value' }]}>
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-col">
                    <Form.Item label="Basic Pay" name={['salary_details', 'BasicpayAMT']} rules={[{ required: true, message: 'Please enter Basic pay value' }]}>
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-col">
                    <Form.Item label="DA Pay" name={['salary_details', 'DApayAMT']} rules={[{ required: true, message: 'Please enter Basic pay value' }]}>
                      <Input />
                    </Form.Item>
                  </div>
                </div>

                
                <div className="form-col">
                    <Form.Item label="HRA Pay" name={['salary_details', 'HRApayAMT']} rules={[{ required: true, message: 'Please enter HRA pay value' }]}>
                      <Input />
                    </Form.Item>
                  </div> */}

                <div className="form-row">
                  <div className="form-col">
                  <Form.Item
                    label="Employee Gross Pay"
                    name={['salary_details', 'CTCpayAMT']}
                    rules={[{ required: true, message: 'Please enter Employee CTC value' }]}
                  >
                    <Input value={grossPay} onChange={handleGrossPayChange} />
                  </Form.Item>
                  </div>

                  <div className="form-col">
                    <Form.Item
                      label="Basic Pay"
                      name={['salary_details', 'BasicpayAMT']}
                      rules={[{ required: true, message: 'Please enter Basic pay value' }]}
                    >
                      <Input value={form.getFieldValue('salary_details.BasicpayAMT')} onChange={handleBasicPayChange} />
                    </Form.Item>
                  </div>
                  
                  <div className="form-col">
                    <Form.Item
                      label="HRA Pay"
                      name={['salary_details', 'HRApayAMT']}
                      rules={[{ required: true, message: 'Please enter HRA pay value' }]}
                    >
                      <Input value={form.getFieldValue('salary_details.HRApayAMT')} onChange={handleHraPayChange} />
                    </Form.Item>
                  </div>
                </div>

                {payrollSettings?.da_enabled && (
                  <div className="form-col">
                      <Form.Item
                        label="DA Pay"
                        name={['salary_details', 'DApayAMT']}
                        rules={[{ required: true, message: 'Please enter DA pay value' }]}
                      >
                        <Input value={form.getFieldValue('salary_details.DApayAMT')} onChange={handleDaPayChange} />
                      </Form.Item>
                  </div>
                )}

                {/* {payrollSettings?.reimbursements && Object.keys(payrollSettings.reimbursements).length > 0 && (
                  <>
                    {Object.entries(payrollSettings.reimbursements).map(([name, amount], index) => (
                      <div className="form-col" key={index}>
                        <Form.Item label={name} name={['reimbursements', name]}>
                          <Input defaultValue={amount} />
                        </Form.Item>
                      </div>
                    ))}
                  </>
                )} */}
                {/* {payrollSettings?.reimbursements && Object.keys(payrollSettings.reimbursements).length > 0 && (
                  <>
                    {Object.entries(payrollSettings.reimbursements).map(([name, amount], index) => (
                      <div className="form-col" key={index}>
                        <Form.Item label={name} name={['reimbursements', name]}>
                          <Input defaultValue={amount} />
                        </Form.Item>
                      </div>
                    ))}
                  </>
                )} */}

                {payrollSettings?.reimbursements && Object.keys(payrollSettings.reimbursements).length > 0 && (
                  <>
                    {Object.entries(payrollSettings.reimbursements).map(([name, amount], index) => (
                      <div className="form-col" key={index}>
                        <Form.Item label={name} name={['salary_details', 'reimbursements', name]}>
                          <Input
                            defaultValue={amount}
                            onChange={(e) => handleReimbursementChange(name, e.target.value)}
                          />
                        </Form.Item>
                      </div>
                    ))}
                  </>
                )}
        
                {payrollSettings?.variable_pay && (
                  <div className="form-col">
                    <Form.Item label="Variable Pay" name={['salary_details', 'VariableAMT']}>
                      {/* <Input onChange={calculateSpecialAllowances} /> */}
                      <Input />
                    </Form.Item>
                  </div>
                )}

                {payrollSettings?.quarterly_allowance && (
                  <div className="form-col">
                    <Form.Item label="Quarterly Allowance" name={['salary_details', 'QAllowanceAMT']}>
                      {/* <Input onChange={calculateSpecialAllowances} /> */}
                      <Input />
                    </Form.Item>
                  </div>
                )}

                {payrollSettings?.quarterly_bonus && (
                  <div className="form-col">
                    <Form.Item label="Quarterly Bonus" name={['salary_details', 'QBonusAMT']}>
                      {/* <Input onChange={calculateSpecialAllowances} /> */}
                      <Input />
                    </Form.Item>
                  </div>
                )}  

                {payrollSettings?.annual_bonus && (
                  <div className="form-col">
                    <Form.Item label="Annual Bonus" name={['salary_details', 'ABonusAMT']}>
                      {/* <Input onChange={calculateSpecialAllowances} /> */}
                      <Input />
                    </Form.Item>
                  </div>
                )}

                {payrollSettings?.special_allowances && (
                  <div className="form-col">
                    <Form.Item label="Special Allowances" name={['salary_details', 'SAllowancesAMT']}>
                      <Input value={specialAllowances} readOnly />
                    </Form.Item>
                  </div>
                )}

                {/* {payrollSettings?.pf && (
                  <>
                    {payrollSettings?.pf_type === 'Both' ? (
                      <Form.Item label="Select PF Type" name={['salary_details', 'pfType']}>
                        <Select onChange={handlePfTypeChange}>
                          <Select.Option value="!=15k">No Limit for PF Deduction</Select.Option>
                          <Select.Option value="15k">Wage limit 15k</Select.Option>
                        </Select>
                      </Form.Item>
                    ) : (
                      <Form.Item label="Provident Fund (PF)" name={['salary_details', 'PFAMT']}>
                        <Input value={pfValue} readOnly />
                      </Form.Item>
                    )}
                  </>
                )} */}
                {payrollSettings?.pf_type === 'Both' && (
                  <Form.Item label="Select PF Type" name={['salary_details', 'pf_type']}>
                    <Select onChange={handlePfTypeChange}>
                      <Select.Option value="!=15k">No Limit for PF Deduction</Select.Option>
                      <Select.Option value="15k">Wage limit 15k</Select.Option>
                    </Select>
                  </Form.Item>
                )}

                {/* <Form.Item label="Provident Fund (PF)" name={['salary_details', 'PFAMT']}>
                  <Input value={pfValue} readOnly />
                </Form.Item> */}
           
                {payrollSettings?.voluntary_pf && (
                  <div className="form-col">
                    <Form.Item label="Voluntary Provident Fund" name={['salary_details', 'VPFAMT']}>
                      <Input />
                    </Form.Item>
                  </div>
                )}

                {/* {payrollSettings?.esi && (
                  <div className="form-col">
                    <Form.Item label="ESI" name={['salary_details', 'ESIAMT']}>
                      <Input />
                    </Form.Item>
                  </div>
                )} */}

                {/* {payrollSettings?.professional_tax && (
                  <div className="form-col">
                      <Form.Item label="Professional Tax" name={['salary_details', 'PTAMT']}>
                          <Input value={professionalTax} readOnly /> 
                      </Form.Item>
                  </div>
                )} */}

                {payrollSettings?.deductions && (
                  <div className="form-col">
                    <Form.Item label="Deductions & Loans" name={['salary_details', 'DLoansAMT']}>
                      <Input />
                    </Form.Item>
                  </div>
                )}
              </TabPane>
          </Tabs>

          <Divider />

          {/* Render Previous/Next buttons for tabs */}
          <Form.Item>
            {activeTabKey !== '1' && (
              <Button onClick={prevTab} style={{ marginRight: '8px' }}>
                Previous
              </Button>
            )}

            {activeTabKey !== '5' ? (
              <Button type="primary" onClick={nextTab}>
                Next
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            )}
            </Form.Item>
        </Form>
      </div>
    </div>
    </div>

  );
};

export default EmployeeSetup;


// {/* Dynamically render fields based on fetched compensation settings  */}
// {compensationSettings?.advances && (
//   <div className="form-col">
//     <Form.Item label="Advances" name={['salary_details', 'advances']}>
//       <Input />
//     </Form.Item>
//   </div>
//   )}
//   {compensationSettings?.variable_pay && (
//     <div className="form-col">
//       <Form.Item label="Variable Pay" name={['salary_details', 'variablePayAMT']}>
//         <Input />
//       </Form.Item>
//     </div>
//   )}
//   {compensationSettings?.quarterly_allowance && (
//   <div className="form-col">
//     <Form.Item label="Quarterly Allowance" name={['salary_details', 'QAllowanceAMT']}>
//       <Input />
//     </Form.Item>
//   </div>
//   )}
//   {compensationSettings?.quarterly_bonus && (
//   <div className="form-col">
//     <Form.Item label="Quarterly Bonus" name={['salary_details', 'QBonusAMT']}>
//       <Input />
//     </Form.Item>
//   </div>
//   )}
//   {compensationSettings?.annual_bonus && (
//   <div className="form-col">
//     <Form.Item label="Annual Bonus:" name={['salary_details', 'ABonusAMT']}>
//       <Input />
//     </Form.Item>
//   </div>
//   )}
//   {compensationSettings?.special_allowances && (
//   <div className="form-col">
//     <Form.Item label="Special Allowances:" name={['salary_details', 'SAllowancesAMT']}>
//       <Input />
//     </Form.Item>
//   </div>
//   )}
//   {compensationSettings?.deductions && (
//   <div className="form-col">
//     <Form.Item label="Deductibles & Loans:" name={['salary_details', 'DLoansAMT']}>
//       <Input />
//     </Form.Item>
//   </div>
//   )}