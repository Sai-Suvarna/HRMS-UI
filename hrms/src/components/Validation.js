// PayCalculationTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Validation.css';
import Navbar from './Navbar';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

const PayCalculationTable = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [payCalculations, setPayCalculations] = useState([]);
  const companyId = localStorage.getItem('companyId');

  // Fetch unique month values on component mount
  useEffect(() => {
    const fetchMonths = async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/paycalculation/unique-months/');
      setMonths(response.data);
    };
    fetchMonths();
  }, []);

  // Fetch data for the selected month
  const fetchPayCalculations = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/paycalculation/by-month/`, {
        params: { month: selectedMonth, company_id: companyId },
      });
      setPayCalculations(response.data);
    } catch (error) {
      console.error('Error fetching pay calculations:', error);
    }
  };

  return (
    <div>
        <Navbar />
        <div style={{ padding: '20px' }}>
        <h2>Pay Calculation Data</h2>

        {/* Dropdown to select month */}
        <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            displayEmpty
            style={{ marginBottom: '20px', minWidth: '200px' }}
        >
            <MenuItem value="" disabled>Select Month</MenuItem>
            {months.map((month, index) => (
            <MenuItem key={index} value={month}>
                {month}
            </MenuItem>
            ))}
        </Select>

        {/* Button to trigger data fetch */}
        <Button variant="contained" color="primary" onClick={fetchPayCalculations} disabled={!selectedMonth}>
            Submit
        </Button>

        {/* Table to display PayCalculation data */}
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>No of Days</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>LOP Days</TableCell>
                <TableCell>OT</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Basic</TableCell>
                <TableCell>HRA</TableCell>
                <TableCell>DA</TableCell>
                <TableCell>Special Allowance</TableCell>
                <TableCell>Gross Pay</TableCell>
                <TableCell>OT Pay</TableCell>
                <TableCell>Allowance</TableCell>
                <TableCell>Total Pay</TableCell>
                <TableCell>eePF</TableCell>
                <TableCell>ESI</TableCell>
                <TableCell>PT</TableCell>
                <TableCell>Deductibles/Loans</TableCell>
                <TableCell>Deductions</TableCell>
                <TableCell>Net Pay</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {payCalculations.map((row, index) => (
                <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.no_of_days}</TableCell>
                    <TableCell>{row.attendance}</TableCell>
                    <TableCell>{row.lop_days}</TableCell>
                    <TableCell>{row.OT}</TableCell>
                    <TableCell>{row.salary}</TableCell>
                    <TableCell>{row.basic}</TableCell>
                    <TableCell>{row.hra}</TableCell>
                    <TableCell>{row.da}</TableCell>
                    <TableCell>{row.special_allowance}</TableCell>
                    <TableCell>{row.grossPay}</TableCell>
                    <TableCell>{row.otPay}</TableCell>
                    <TableCell>{row.allowance}</TableCell>
                    <TableCell>{row.totalPay}</TableCell>
                    <TableCell>{row.eePF}</TableCell>
                    <TableCell>{row.esi}</TableCell>
                    <TableCell>{row.pt}</TableCell>
                    <TableCell>{row.deductiblesLoans}</TableCell>
                    <TableCell>{row.deductions}</TableCell>
                    <TableCell>{row.net_pay}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </div>
    </div>
  );
};

export default PayCalculationTable;
