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
  const [form] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState('1'); // State to keep track of the active tab
  const [compensationSettings, setCompensationSettings] = useState({});
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('payrollData'));
    if (storedData) {
      setCompensationSettings(storedData);
    }
  }, []);

  const handleTabChange = (key) => {
    setActiveTabKey(key); // Update the active tab key
  };
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      // Format date fields
      const formattedValues = {
        ...values,
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
        }
      };

      // Make the API request to save employee data
      await axios.post('http://localhost:8000/employee/', formattedValues);

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
          <Tabs defaultActiveKey="1" onChange={handleTabChange}>
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
                  <Form.Item label="UAN Number" name={['social_security_details', 'uanNum']} rules={[{ required: true, message: 'Please enter UAN number' }]}>
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
                  <Form.Item label="IFSC Code" name={['social_security_details', 'ifscCode']} rules={[{ required: true, message: 'Please enter IFSC code' }]}>
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
              <div className="form-row">
                <div className="form-col">
                  <Form.Item label="Employee CTC" name={['salary_details', 'CTCpayAMT']} rules={[{ required: true, message: 'Please enter Employee CTC value' }]}>
                    <Input />
                  </Form.Item>
                </div>

                <div className="form-col">
                  <Form.Item label="Basic Pay" name={['salary_details', 'BasicpayAMT']} rules={[{ required: true, message: 'Please enter Basic pay value' }]}>
                    <Input />
                  </Form.Item>
                </div>

                <div className="form-col">
                  <Form.Item label="HRA pay" name={['salary_details', 'HRApayAMT']} rules={[{ required: true, message: 'Please enter HRA pay value' }]}>
                    <Input />
                  </Form.Item>
                </div>
              </div>
                            
              {/* Dynamically render fields based on fetched compensation settings  */}
              {compensationSettings?.advances && (
              <div className="form-col">
                <Form.Item label="Advances" name={['salary_details', 'advances']}>
                  <Input />
                </Form.Item>
              </div>
              )}
              {compensationSettings?.variable_pay && (
                <div className="form-col">
                  <Form.Item label="Variable Pay" name={['salary_details', 'variablePayAMT']}>
                    <Input />
                  </Form.Item>
                </div>
              )}
              {compensationSettings?.quarterly_allowance && (
              <div className="form-col">
                <Form.Item label="Quarterly Allowance" name={['salary_details', 'QAllowanceAMT']}>
                  <Input />
                </Form.Item>
              </div>
              )}
              {compensationSettings?.quarterly_bonus && (
              <div className="form-col">
                <Form.Item label="Quarterly Bonus" name={['salary_details', 'QBonusAMT']}>
                  <Input />
                </Form.Item>
              </div>
              )}
              {compensationSettings?.annual_bonus && (
              <div className="form-col">
                <Form.Item label="Annual Bonus:" name={['salary_details', 'ABonusAMT']}>
                  <Input />
                </Form.Item>
              </div>
              )}
              {compensationSettings?.special_allowances && (
              <div className="form-col">
                <Form.Item label="Special Allowances:" name={['salary_details', 'SAllowancesAMT']}>
                  <Input />
                </Form.Item>
              </div>
              )}
              {compensationSettings?.deductions && (
              <div className="form-col">
                <Form.Item label="Deductibles & Loans:" name={['salary_details', 'DLoansAMT']}>
                  <Input />
                </Form.Item>
              </div>
              )}
            </TabPane>
          </Tabs>

          <Divider />

          {/* Conditionally render the submit button */}
          {activeTabKey === '5' && (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
    </div>

  );
};

export default EmployeeSetup;
