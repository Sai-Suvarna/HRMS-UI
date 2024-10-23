import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import './TimeSheetPage.css';
import Navbar from './Navbar';

// Function to convert Excel date serial number to "MMM YYYY" format (e.g., "Feb 2024")
const convertExcelDate = (serial) => {
  const excelDate = new Date(Math.round((serial - 25569) * 86400 * 1000));
  const options = { year: 'numeric', month: 'short' };
  return excelDate.toLocaleDateString('en-US', options);
};

// Function to validate no_of_days based on the month
const isValidDays = (month, noOfDays) => {
  const monthDays = {
    January: 31,
    February: 28, // Leap year check will be handled on the backend
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  // Check if month is valid
  if (!(month in monthDays)) {
    return false;
  }

  // Check for leap year in February
  const currentYear = new Date().getFullYear();
  if (month === 'February') {
    if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0)) {
      monthDays['February'] = 29; // Leap year
    }
  }

  // Ensure noOfDays is treated as a number
  return Number(noOfDays) === monthDays[month];
};

const TimeSheetPage = () => {
  const [timeSheetData, setTimeSheetData] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [showMissingOptions, setShowMissingOptions] = useState(false);
  const [missingEmployees, setMissingEmployees] = useState([]);
  const [showExtraOptions, setShowExtraOptions] = useState(false); // New state for extra employees
  const [extraEmployees, setExtraEmployees] = useState([]); // New state for extra employees
  const navigate = useNavigate(); // useNavigate for navigation

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const processedData = data.slice(1).map((row) => ({
        sno: row[0],
        name: row[1],
        month: convertExcelDate(row[2]),
        noOfDays: row[3],
        attendance: row[4],
        lopDays: row[5],
        empId: row[6],
      }));

      setTimeSheetData(processedData);
    };

    reader.readAsBinaryString(file);
  };

  const fetchEmployeeData = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await fetch(`http://localhost:8000/api/employee/work-details/?company_id=${companyId}`);
      const data = await response.json();
      console.log('Fetched employee data:', data); // Log the fetched data

      return Array.isArray(data.work_details) ? data.work_details : []; 
    } catch (error) {
      console.error('Error fetching employee data:', error);
      return [];
    }
  };

  const handleSubmit = async () => {
    setErrorMessages([]);

    const employeeData = await fetchEmployeeData();
    const companyId = localStorage.getItem('companyId');  // Fetch company ID from local storage
    if (!Array.isArray(employeeData)) {
      console.error('Expected employeeData to be an array but got:', employeeData);
      return;
    }

    const employeeSet = new Set(employeeData.map((emp) => emp.empId));
    const timesheetEmployeeSet = new Set(timeSheetData.map((entry) => String(entry.empId)));

    console.log('Employee Set:', employeeSet);
    console.log('Timesheet Employee Set:', timesheetEmployeeSet);
  
    // Check for missing employees (in employeeSet but not in timesheetEmployeeSet)
    const missingEmployees = [...employeeSet].filter((empId) => !timesheetEmployeeSet.has(empId));
    console.log('Missing Employees:', missingEmployees);

    // Check for extra employees (in timesheetEmployeeSet but not in employeeSet)
    const extraEmployees = [...timesheetEmployeeSet].filter((empId) => !employeeSet.has(empId));
    console.log('Extra Employees:', extraEmployees);

    // If there are missing employees or extra employees, show the respective messages
    if (missingEmployees.length > 0 || extraEmployees.length > 0) {
      // Handle missing employees message
      if (missingEmployees.length > 0) {
        setMissingEmployees(missingEmployees); // Store the missing employees
        setShowMissingOptions(true); // Show the Yes/No options for missing employees
      }

      // Handle extra employees message
      if (extraEmployees.length > 0) {
        setExtraEmployees(extraEmployees); // Store the extra employees
        setShowExtraOptions(true); // Show the Yes/No options for extra employees
      }

      return; // Return here if either missing or extra employees are found
    }

    // Rest of the validation logic
    const invalidEntries = timeSheetData.map((entry) => {
      const monthName = entry.month.split(' ')[0];
      const fullMonthName = new Date(`${monthName} 1`).toLocaleString('default', { month: 'long' });
      const daysWorked = Number(entry.noOfDays);
      const attendance = Number(entry.attendance);
      const lopDays = Number(entry.lopDays);
      const isDaysValid = isValidDays(fullMonthName, daysWorked);
      const isAttendanceValid = attendance <= daysWorked;
      const isAttendanceLopValid = attendance + lopDays === daysWorked;
      const isEmpIdValid = employeeSet.has(String(entry.empId));

      return {
        entry,
        isDaysValid,
        isAttendanceValid,
        isAttendanceLopValid,
        isEmpIdValid,
      };
    }).filter((validation) => !validation.isDaysValid || !validation.isAttendanceValid || !validation.isAttendanceLopValid || !validation.isEmpIdValid);

    if (invalidEntries.length > 0) {
      const messages = invalidEntries.map(({ entry, isDaysValid, isAttendanceValid, isAttendanceLopValid, isEmpIdValid }) => {
        let message = `${entry.name}: `;
        const monthName = entry.month.split(' ')[0];
        const fullMonthName = new Date(`${monthName} 1`).toLocaleString('default', { month: 'long' });
        const daysWorked = Number(entry.noOfDays);
        const attendance = Number(entry.attendance);
        const lopDays = Number(entry.lopDays);

        if (!isDaysValid) {
          message += `${daysWorked} is not a valid number of days in ${fullMonthName}. `;
        }
        if (!isAttendanceValid) {
          message += `Attendance (${attendance}) exceeds the number of days (${daysWorked}). `;
        }
        if (!isAttendanceLopValid) {
          message += `Attendance (${attendance}) + LOP Days (${lopDays}) should equal the number of days (${daysWorked}). `;
        }
        if (!isEmpIdValid) {
          message += `EmpId (${entry.empId}) for ${entry.name} is not valid. `;
        }

        return message;
      });

      setErrorMessages(messages);
      return;
    }

    // Add company_id to each timesheet entry before uploading
    const updatedTimeSheetData = timeSheetData.map((entry) => ({
      ...entry,
      company: companyId,  // Attach companyId to each entry
    }));

    fetch('http://127.0.0.1:8000/timesheet/upload/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTimeSheetData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Data uploaded successfully!');
      })
      .catch((error) => {
        console.error('Error uploading data:', error);
      });
  };

  const handleYesMissing = () => {
    navigate('/employeelist'); // Navigate if the user chooses to delete missing employees
  };

  const handleNoMissing = () => {
    setShowMissingOptions(false); // Hide the Yes/No options for missing employees
  };

  const handleYesExtra = () => {
    navigate('/employeesetup');
  };

  const handleNoExtra = () => {
    setShowExtraOptions(false); // Hide the Yes/No options for extra employees
  };

  return (
    <div>
     <Navbar />
    <div className="timesheet-container">
      <h1>Upload Time Sheet</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="upload-button" />
      {timeSheetData.length > 0 && (
        <>
          <h2>Time Sheet Data</h2>
          <table>
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Name</th>
                <th>Month</th>
                <th>No. of Days</th>
                <th>Attendance</th>
                <th>LOP Days</th>
                <th>Emp ID</th>
              </tr>
            </thead>
            <tbody>
              {timeSheetData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.sno}</td>
                  <td>{entry.name}</td>
                  <td>{entry.month}</td>
                  <td>{entry.noOfDays}</td>
                  <td>{entry.attendance}</td>
                  <td>{entry.lopDays}</td>
                  <td>{entry.empId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {errorMessages.length > 0 && (
        <div className="error-messages">
          <h2>Error Messages</h2>
          <ul>
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleSubmit}>Submit</button>

      {/* Missing Employees Options */}
      {showMissingOptions && (
        <div className="modal">
          <h3>Missing Employees Found</h3>
          <p>Do you want to remove the missing employees from the employee data?</p>
          <button onClick={handleYesMissing}>Yes</button>
          <button onClick={handleNoMissing}>No</button>
          <div>
            <h4>Missing Employees:</h4>
            <ul>
              {missingEmployees.map((empId, index) => (
                <li key={index}>{empId}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Extra Employees Options */}
      {showExtraOptions && (
        <div className="modal">
          <h3>New Employees Found</h3>
          <p>Do you want to add the new employees to the employee data?</p>
          <button onClick={handleYesExtra}>Yes</button>
          <button onClick={handleNoExtra}>No</button>
          <div>
            <h4>New Employees:</h4>
            <ul>
              {extraEmployees.map((empId, index) => (
                <li key={index}>{empId}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default TimeSheetPage;
