import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Payslip.css'; // Create a separate CSS file for styling the payslip

const Payslip = () => {
  const [form] = Form.useForm();

  const handleCalculateSubmit = () => {
    // You can add form handling logic here
    console.log("Form Submitted");
    form.resetFields();
  };

  const exportPDF = () => {
    const input = document.getElementById('payslip-table');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('payslip.pdf');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
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
            {/* Add the rows similar to your previous design */}
            {/* You can copy this section from your current "Calculations" tab */}
          </tbody>
        </table>
      </div>

      {/* Button to Export Table as PDF */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button type="primary" onClick={exportPDF}>
          Export as PDF
        </Button>
      </div>
    </div>
  );
};

export default Payslip;
