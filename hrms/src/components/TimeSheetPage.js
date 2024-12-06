import React, { useState, useEffect} from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import '../styles/TimeSheetPage.css';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Navbar from '../pages/Navbar';
import api from "../api";
import { fetchUserId, fetchCompanyId } from '../helpers/CompanyId';


const steps = [
  'Download Excel Template',
  'Upload Attendance Sheet',
  'Review and Calculate Pay',
];

const formatMonthToMMYYYY = (month) => {
  const [shortMonth, year] = month.split(' ');
  const date = new Date(`${shortMonth} 1, ${year}`);
  const monthNum = String(date.getMonth() + 1).padStart(2, '0'); 
  return `${monthNum}-${year}`;
};

// Function to convert Excel date serial number to "MMM YYYY" format (e.g., "Feb 2024")
const convertExcelDate = (serial) => {
  const excelDate = new Date(Math.round((serial - 25569) * 86400 * 1000));
  const options = { year: 'numeric', month: 'short' };
  return excelDate.toLocaleDateString('en-US', options);
};

// Function to validate noOfDays based on the month
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
  const [downloadedFileName, setDownloadedFileName] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState(''); // Store the uploaded file name
  const [activeStep, setActiveStep] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [timeSheetData, setTimeSheetData] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [showMissingOptions, setShowMissingOptions] = useState(false);
  const [missingEmployees, setMissingEmployees] = useState([]);
  const [showExtraOptions, setShowExtraOptions] = useState(false); // New state for extra employees
  const [extraEmployees, setExtraEmployees] = useState([]); // New state for extra employees
  const navigate = useNavigate(); // useNavigate for navigation
  // const [timesheets, setTimesheets] = useState([]);
  // const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [payrollSettings, setPayrollSettings] = useState(null);
  const [dynamicHeaders, setDynamicHeaders] = useState([]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const downloadTemplate = () => {
    // Logic to download template
    const worksheet = XLSX.utils.json_to_sheet([]);
    const headers = ['SNO','Emp ID', 'Name', 'Month', 'No. of Days', 'Attendance', 'LOP Days', 'OT', 'Allowance', 'Deductions'];
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TimeSheet');
    const fileName = 'attendance_template.xlsx';
  XLSX.writeFile(workbook, fileName);
  
  // Set the downloaded file name state
  setDownloadedFileName(fileName); // Call setDownloadedFileName to utilize it
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name); // Store the uploaded file name

      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const processedData = data.slice(1).map((row) => ({
          sno: row[0],
          empId: row[1],
          name: row[2],
          month: convertExcelDate(row[3]),
          noOfDays: row[4],
          attendance: row[5],
          lopDays: row[6],
          OT: row[7],
          allowance: row[8],
          deductions: row[9],
        }));

        setTimeSheetData(processedData);
      };

      reader.readAsBinaryString(file);
    }
  };

  const fetchTimesheets = async () => {
    // const companyId = localStorage.getItem('companyId');

    const userId = await fetchUserId();
    if (!userId) {
      setError('User ID not found');
      return;
    }

    // const role = await fetchRole(); // Fetch userId using helper function
    // console.log("Role:",role)
    // if (!role) {
    //   setError('Role not found');
    //   return;
    // }

    // const companyId = await fetchCompanyId(userId, role); 


    const companyId = await fetchCompanyId(userId);
    if (!companyId) {
      setError('Company ID not found');
      return;
    }

    const month = localStorage.getItem('month'); // Retrieve the month from local storage

    console.log('Fetching timesheets for company ID:', companyId, 'and month:', month);

    try {
      const response = await api.get(`/api/timesheet-view/${companyId}/${month}/`);
        console.log('Fetched Timesheets:', response.data.Attendance_data);
        setTimesheets(response.data.Attendance_data);
    } catch (error) {
        console.error('Error fetching timesheets:', error);
    }
};

    const fetchCompensationSettings = async () => {
      try {

        // const companyId = localStorage.getItem('companyId');

        const userId = await fetchUserId();
        if (!userId) {
          setError('User ID not found');
          return;
        }
        // const role = await fetchRole(); // Fetch userId using helper function
        // console.log("Role:",role)
        // if (!role) {
        //   setError('Role not found');
        //   return;
        // }
  
        // const companyId = await fetchCompanyId(userId, role); 
    
    
        const companyId = await fetchCompanyId(userId);
        if (!companyId) {
          setError('Company ID not found');
          return;
        }

        if (!companyId) {
          console.error('Company ID not found');
          return;
        }
        const response = await api.get(`/api/payroll-settings/${companyId}/`);

        // const response = await axios.get(`http://localhost:8000/payroll-settings/${companyId}/`);
        console.log('Fetched Payroll Settings:', response.data); // Debug: Check if data is fetched
        setPayrollSettings(response.data); // Store the fetched settings
      } catch (error) {
        console.error('Error fetching payroll settings:', error);
      }
    };

    useEffect(() => {
      fetchCompensationSettings();
    }, []);

//   const fetchEmployeeData = async () => {
//     const companyId = localStorage.getItem('companyId');
//     console.log("CID:",companyId)
//     try {

//       // const response = await api.fetch(`/api/employee/work-details/?company_id=${companyId}`);

//       // const response = await fetch(`http://localhost:8000/api/employee/work-details/?company_id=${companyId}`);
  

//       // const response = await fetch(`http://localhost:8000/api/employee/work-details/?company_id=${companyId}`, {
//       //   method: 'GET', 
//       //   headers: {
//       //       'Authorization': `Bearer ${localStorage.getItem('access')}`, 
//       //       'Content-Type': 'application/json', 
//       //   },
//       // });

//     // const response = await api.get(`/api/employee/work-details/?company_id=${companyId}`, {
      
//     //   headers: {
//     //       'Content-Type': 'application/json', 
//     //   },
//     // });

//   const response = await api.get(`/api/employee/work-details/`, {
//     params: { company_id: companyId }, // Clean way to handle query parameters
//     headers: {
//         'Content-Type': 'application/json', // Optional, depending on API requirements
//     },
// });
  


//       if (!response.ok) {
//         console.error('Failed to fetch employee data:', response.statusText);
//         return [];
//       }
  
//       const data = await response.json();
//       console.log('API Response:', data); // Log the entire response for debugging
  
//       // Ensure the response contains the 'custom_work_details' key
//       if (data && Array.isArray(data.custom_work_details)) {
//         setEmployeeData(data.custom_work_details);
//         return data.custom_work_details;
//       } else {
//         console.error('Invalid response format:', data);
//         return []; // Return an empty array if the structure is not as expected
//       }
//     } catch (error) {
//       console.error('Error fetching employee data:', error);
//       return []; // Handle fetch errors by returning an empty array
//     }
//   };  
    

const fetchEmployeeData = async () => {
  // const companyId = localStorage.getItem('companyId');
  const userId = await fetchUserId();
  if (!userId) {
    setError('User ID not found');
    return;
  }
  // const role = await fetchRole(); // Fetch userId using helper function
  // console.log("Role:",role)
  // if (!role) {
  //   setError('Role not found');
  //   return;
  // }

  // const companyId = await fetchCompanyId(userId, role); 


  const companyId = await fetchCompanyId(userId);
  if (!companyId) {
    setError('Company ID not found');
    return;
  }

  console.log("CID:", companyId);

  try {
      const response = await api.get(`/api/employee/work-details/`, {
          params: { company_id: companyId }, // Query parameters
          headers: {
              'Content-Type': 'application/json', // Optional, based on API requirements
          },
      });

      // Axios automatically resolves the response; if status is not 2xx, it will throw an error.
      console.log('API Response:', response.data); // Log the entire response for debugging

      // Ensure the response contains the 'custom_work_details' key
      if (response.data && Array.isArray(response.data.custom_work_details)) {
          setEmployeeData(response.data.custom_work_details);
          return response.data.custom_work_details;
      } else {
          console.error('Invalid response format:', response.data);
          return []; // Return an empty array if the structure is not as expected
      }
  } catch (error) {
      console.error('Error fetching employee data:', error.message || error);
      return []; // Return an empty array on error
  }
};


  // Effect to fetch timesheets again when entering Step 3
  useEffect(() => {
    if (activeStep === 2) {
      fetchTimesheets();
      fetchEmployeeData();
      fetchCompensationSettings();
    }
  }, [activeStep]);

  // Calculate pay data
  // useEffect(() => {
  //   if (timesheets.length > 0 && employeeData.length > 0) {
  //     const result = timesheets.map((attendanceEntry) => {
  //       const empId = attendanceEntry.empId;
  //       const employee = employeeData.find((emp) => emp.empId === empId);

  //       if (!employee) return null;

  //       const { CTCpayAMT, DLoansAMT } = employee.salary_details[0];
  //       const { attendance, noOfDays, OT } = attendanceEntry;

  //       const grossPay = Math.round((CTCpayAMT * attendance) / noOfDays);
  //       const basic = Math.round(grossPay * 0.5);
  //       const hra = Math.round(basic * 0.5);
  //       const specialAllowance = grossPay - basic - hra;
  //       const otPay = Math.round((grossPay * OT) / noOfDays);
  //       const totalPay = grossPay + otPay;
  //       const eePF = Math.round(basic > 15000 ? 15000 * 0.12 : basic * 0.12);
  //       const esi = Math.round((totalPay - eePF)  * 0.0075);
  //       const pt = grossPay > 20000 ? 200 : grossPay > 15000 ? 150 : 0;
  //       const netPay = totalPay - eePF - esi - pt - DLoansAMT;

  //       return {
  //         ...attendanceEntry,
  //         salary: CTCpayAMT,
  //         basic,
  //         hra,
  //         specialAllowance,
  //         grossPay,
  //         otPay,
  //         totalPay,
  //         eePF: eePF.toFixed(2),
  //         esi: esi.toFixed(2),
  //         pt,
  //         deductiblesLoans: DLoansAMT,
  //         netPay: netPay.toFixed(2),
  //       };
  //     });

  //     setCalculatedData(result.filter(Boolean)); // Filter out any null entries
  //   }
  // }, [timesheets, employeeData]);

  // Calculate pay data
  // useEffect(() => {
  //   if (timesheets.length > 0 && employeeData.length > 0 && payrollSettings) {
  //     const result = timesheets.map((attendanceEntry) => {
  //       const empId = attendanceEntry.empId;
  //       const employee = employeeData.find((emp) => emp.empId === empId);
  
  //       if (!employee) return null;
  
  //       const { CTCpayAMT, DLoansAMT } = employee.salary_details[0];
  //       const { attendance, noOfDays, OT } = attendanceEntry;
  
  //       // Use payroll settings for percentage calculations
  //       const basicPercentage = payrollSettings.basic_percentage / 100;
  //       const hraPercentage = payrollSettings.hra_percentage / 100;
  
  //       const grossPay = Math.round((CTCpayAMT * attendance) / noOfDays);
  //       const basic = Math.round(grossPay * basicPercentage);
  //       const hra = Math.round(basic * hraPercentage);
  //       const specialAllowance = grossPay - basic - hra;
  //       const otPay = Math.round((grossPay * OT) / noOfDays);
  //       const totalPay = grossPay + otPay;
  
  //       // Use payroll settings for PF calculation based on `pf_type`
  //       let eePF = 0;
  //       if (payrollSettings.pf) {
  //         if (payrollSettings.pf_type === '15k') {
  //           eePF = Math.round(basic > 15000 ? 15000 * 0.12 : basic * 0.12);
  //         } else {
  //           eePF = Math.round(basic * 0.12);
  //         }
  //       }

  //       const esi = payrollSettings.esi ? Math.round((totalPay - eePF) * 0.0075) : 0;
  //       const pt = payrollSettings.professional_tax
  //         ? totalPay > 20000
  //           ? 200
  //           : totalPay > 15000
  //           ? 150
  //           : 0
  //         : 0;
  
  //       const netPay = totalPay - eePF - esi - pt - DLoansAMT;
  
  //       return {
  //         ...attendanceEntry,
  //         salary: CTCpayAMT,
  //         basic,
  //         hra,
  //         specialAllowance,
  //         grossPay,
  //         otPay,
  //         totalPay,
  //         eePF: eePF.toFixed(2),
  //         esi: esi.toFixed(2),
  //         pt,
  //         deductiblesLoans: DLoansAMT,
  //         netPay: netPay.toFixed(2),
  //       };
  //     });
  
  //     setCalculatedData(result.filter(Boolean)); // Filter out any null entries
  //   }
  // }, [timesheets, employeeData, payrollSettings]);


  const calculateEEPF = (basic, payrollSettings) => {
    let eePF = 0;
    if (payrollSettings.pf) {
      if (payrollSettings.pf_type === '15k') {
        eePF = Math.round(basic > 15000 ? 15000 * 0.12 : basic * 0.12);
      } else {
        eePF = Math.round(basic * 0.12);
      }
    }
    return eePF;
  };
  
  useEffect(() => {
    if (timesheets.length > 0 && employeeData.length > 0 && payrollSettings) {
      const result = timesheets.map((attendanceEntry) => {
        const empId = attendanceEntry.empId;
        const employee = employeeData.find((emp) => emp.empId === empId);
  
        if (!employee) return null;
  
        const { CTCpayAMT, DLoansAMT } = employee.salary_details[0];
        const { attendance, no_of_days, OT, allowance, deductions } = attendanceEntry;
  
        // Basic Calculation
        const basicPercentage = payrollSettings.basic_percentage / 100;
        const daPercentage = payrollSettings.da_percentage / 100;
        const hraPercentage = payrollSettings.hra_percentage / 100;
  
        let basic, da, hra, grossPay, specialAllowance;

        // Reimbursement Calculation
        const reimbursements = employee.salary_details[0].reimbursements || {};
        let reimbursementTotal = 0;
        const reimbursementDetails = [];

        for (const [name, value] of Object.entries(reimbursements)) {
            const reimbursementValue = parseFloat(value);
            reimbursementTotal += reimbursementValue;
            reimbursementDetails.push({ name, amount: reimbursementValue });
        }

        if (payrollSettings.da_enabled && !payrollSettings.hra_enabled) {
          // DA enabled, HRA disabled
          const E_Basic = Math.round(CTCpayAMT * basicPercentage);
          const E_DA = Math.round(CTCpayAMT * daPercentage);
          basic = Math.round((E_Basic * attendance) / no_of_days);
          da = Math.round((E_DA * attendance) / no_of_days);
          grossPay = basic + da;
          specialAllowance = grossPay - basic - da - reimbursementTotal;
        } else if (payrollSettings.da_enabled && payrollSettings.hra_enabled) {
          // Both DA and HRA enabled
          const E_Basic = Math.round(CTCpayAMT * basicPercentage);
          const E_DA = Math.round(E_Basic * daPercentage);
          const E_HRA = Math.round(E_Basic * hraPercentage);
          basic = Math.round((E_Basic * attendance) / no_of_days);
          hra = Math.round((E_HRA * attendance) / no_of_days);
          da = Math.round((E_DA * attendance) / no_of_days);
          grossPay = basic + hra + da;
          specialAllowance = grossPay - basic - hra - da - reimbursementTotal;
        } else if(!payrollSettings.da_enabled && payrollSettings.hra_enabled) {
          // DA disabled HRA enabled
          // grossPay = Math.round((CTCpayAMT * attendance) / no_of_days);
          // basic = Math.round(grossPay * basicPercentage);
          // hra = Math.round(basic * hraPercentage);
          // da = 0;
          // specialAllowance = grossPay - basic - hra - reimbursementTotal;
          const E_Basic = Math.round(CTCpayAMT * basicPercentage);
          const E_HRA = Math.round(E_Basic * hraPercentage);
          const E_Reambesments = reimbursementTotal;
          const E_SA = CTCpayAMT - (E_Basic + E_HRA + E_Reambesments);
          basic = Math.round((E_Basic * attendance) / no_of_days);
          hra = Math.round((E_HRA * attendance) / no_of_days);
          specialAllowance = Math.round((E_SA * attendance) / no_of_days);
          grossPay = basic + hra + specialAllowance;
          da = 0;
        } else {
          // Default case if neither DA nor HRA is enabled
          basic = Math.round((CTCpayAMT * basicPercentage * attendance) / no_of_days);
          da = 0;
          hra = 0;
          grossPay = basic;
          specialAllowance = grossPay - basic - reimbursementTotal;
        }
  
        // OT Calculation
        const otPay = Math.round((grossPay * OT) / no_of_days);
        const totalPay = grossPay + otPay + allowance;

        

        
  
        // PF Calculation using the new function
        const eePF = calculateEEPF(basic, payrollSettings);
  
        // ESI and PT Calculation
        const esi = payrollSettings.esi ? Math.round((totalPay - eePF) * 0.0075) : 0;
        const pt = payrollSettings.professional_tax
          ? totalPay > 20000
            ? 200
            : totalPay > 15000
            ? 150
            : 0
          : 0;
  
        // Final Net Pay Calculation
        const netPay = totalPay - eePF - esi - pt - DLoansAMT - deductions;
  
        return {
          ...attendanceEntry,
          salary: CTCpayAMT,
          basic,
          hra: hra || 0, // Ensure HRA is 0 if not applicable
          da: da || 0, // Ensure DA is 0 if not applicable
          special_allowance: specialAllowance,
          grossPay,
          otPay,
          allowance,
          totalPay,
          eePF: eePF.toFixed(2),
          esi: esi.toFixed(2),
          pt,
          deductiblesLoans: DLoansAMT,
          deductions,
          net_pay: netPay.toFixed(2),
        };
      });
  
      setCalculatedData(result.filter(Boolean)); // Filter out any null entries
    }
  }, [timesheets, employeeData, payrollSettings]);
  

  useEffect(() => { 
    fetchEmployeeData();
  }, []);


  // working handle submit
  // const handleSubmit = async () => {
  //   setErrorMessages([]);
  //   setSuccessMessage(''); 
  //   if (uploadedFileName !== downloadedFileName) {
  //     console.log("upname",uploadedFileName)
  //     console.log("downname",downloadedFileName)
  //     alert('The uploaded file name must be the same as the downloaded file name.');
  //     return; 
  //   }

  //   const employeeData = await fetchEmployeeData();
  //   const companyId = localStorage.getItem('companyId');  // Fetch company ID from local storage
  //   if (!Array.isArray(employeeData)) {
  //     console.error('Expected employeeData to be an array but got:', employeeData);
  //     return;
  //   }

  //   const employeeSet = new Set(employeeData.map((emp) => emp.empId));
  //   const timesheetEmployeeSet = new Set(timeSheetData.map((entry) => String(entry.empId)));

  //   console.log('Employee Set:', employeeSet);
  //   console.log('Timesheet Employee Set:', timesheetEmployeeSet);
  
  //   const missingEmployees = [...employeeSet].filter((empId) => !timesheetEmployeeSet.has(empId));
  //   console.log('Missing Employees:', missingEmployees);

  //   const extraEmployees = [...timesheetEmployeeSet].filter((empId) => !employeeSet.has(empId));
  //   console.log('Extra Employees:', extraEmployees);

  //   if (missingEmployees.length > 0 || extraEmployees.length > 0) {
  //     if (missingEmployees.length > 0) {
  //       setMissingEmployees(missingEmployees); 
  //       setShowMissingOptions(true); 
  //     }

  //     if (extraEmployees.length > 0) {
  //       setExtraEmployees(extraEmployees); 
  //       setShowExtraOptions(true); 
  //     }

  //     return; 
  //   }

  //   const invalidEntries = timeSheetData.map((entry) => {
  //     const monthName = entry.month.split(' ')[0];
  //     const fullMonthName = new Date(`${monthName} 1`).toLocaleString('default', { month: 'long' });
  //     const daysWorked = Number(entry.noOfDays);
  //     const attendance = Number(entry.attendance);
  //     const lopDays = Number(entry.lopDays);
  //     const isDaysValid = isValidDays(fullMonthName, daysWorked);
  //     const isAttendanceValid = attendance <= daysWorked;
  //     const isAttendanceLopValid = attendance + lopDays === daysWorked;
  //     const isEmpIdValid = employeeSet.has(String(entry.empId));

  //     return {
  //       entry,
  //       isDaysValid,
  //       isAttendanceValid,
  //       isAttendanceLopValid,
  //       isEmpIdValid,
  //     };
  //   }).filter((validation) => !validation.isDaysValid || !validation.isAttendanceValid || !validation.isAttendanceLopValid || !validation.isEmpIdValid);

  //   if (invalidEntries.length > 0) {
  //     const messages = invalidEntries.map(({ entry, isDaysValid, isAttendanceValid, isAttendanceLopValid, isEmpIdValid }) => {
  //       let message = `${entry.name}: `;
  //       const monthName = entry.month.split(' ')[0];
  //       const fullMonthName = new Date(`${monthName} 1`).toLocaleString('default', { month: 'long' });
  //       const daysWorked = Number(entry.noOfDays);
  //       const attendance = Number(entry.attendance);
  //       const lopDays = Number(entry.lopDays);

  //       if (!isDaysValid) {
  //         message += `${daysWorked} is not a valid number of days in ${fullMonthName}. `;
  //       }
  //       if (!isAttendanceValid) {
  //         message += `Attendance (${attendance}) exceeds the number of days (${daysWorked}). `;
  //       }
  //       if (!isAttendanceLopValid) {
  //         message += `Attendance (${attendance}) + LOP Days (${lopDays}) should equal the number of days (${daysWorked}). `;
  //       }
  //       if (!isEmpIdValid) {
  //         message += `EmpId (${entry.empId}) for ${entry.name} is not valid. `;
  //       }

  //       return message;
  //     });

  //     setErrorMessages(messages);
  //     return;
  //   }

  //   const updatedTimeSheetData = timeSheetData.map((entry) => ({
  //     ...entry,
  //     company: companyId,  
  //   }));

  //   // If all validations pass, submit the timesheet data
  //   try {

  //     const response = await fetch('http://127.0.0.1:8000/timesheet/upload/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedTimeSheetData),
  //     });
  //     if (response.ok) {
  //     setSuccessMessage('Data uploaded successfully!'); // Display success message
  //   } else {
  //     const data = await response.json();
  //     setErrorMessages([data.message || 'Error uploading data.']); // Show server error
  //   }
  //   } catch (error) {
  //     console.error('Error uploading data:', error);
  //     setErrorMessages(['There was an error in submitting your data.']); // Display error message
  //   }
  // };
  // working handle submit

  const handleSubmit = async () => {
    setErrorMessages([]);
    // setSuccessMessage(''); 
    // Fetch employee data from the new API structure
    // const companyId = localStorage.getItem('companyId');  
    // const employeeData = await fetchEmployeeData(); 
  
    setSuccessMessage(''); 
    if (uploadedFileName !== downloadedFileName) {
      console.log("upname",uploadedFileName)
      console.log("downname",downloadedFileName)
      alert('The uploaded file name must be the same as the downloaded file name.');
      return; 
    }

    const employeeData = await fetchEmployeeData();
    // const companyId = localStorage.getItem('companyId');  // Fetch company ID from local storage
    const userId = await fetchUserId();
    if (!userId) {
      setError('User ID not found');
      return;
    }
    // const role = await fetchRole(); // Fetch userId using helper function
    // console.log("Role:",role)
    // if (!role) {
    //   setError('Role not found');
    //   return;
    // }

    // const companyId = await fetchCompanyId(userId, role); 


    const companyId = await fetchCompanyId(userId);
    if (!companyId) {
      setError('Company ID not found');
      return;
    }
    
    if (!Array.isArray(employeeData)) {
      console.error('Expected employeeData to be an array but got:', employeeData);
      return;
    }
  
    // Extract employee IDs from the new response structure
    // const employeeSet = new Set(employeeData.map(emp => String(emp.empId)));
    // const timesheetEmployeeSet = new Set(timeSheetData.map(entry => String(entry.empId)));
  
    // console.log('Employee Set:', employeeSet);
    // console.log('Timesheet Employee Set:', timesheetEmployeeSet);
  
    // Check for missing employees (present in employeeSet but not in timesheetEmployeeSet)
    // const missingEmployees = [...employeeSet].filter(empId => !timesheetEmployeeSet.has(empId));
    // console.log('Missing Employees:', missingEmployees);
  
    // Check for extra employees (present in timesheetEmployeeSet but not in employeeSet)
    // const extraEmployees = [...timesheetEmployeeSet].filter(empId => !employeeSet.has(empId));
    // console.log('Extra Employees:', extraEmployees);


    // If there are missing employees or extra employees, show the respective messages
  
    // If there are missing employees or extra employees, show the respective messages
    // if (missingEmployees.length > 0 || extraEmployees.length > 0) {
    //   if (missingEmployees.length > 0) {
    //     setMissingEmployees(missingEmployees);
    //     setShowMissingOptions(true); // Show Yes/No options for missing employees
    //   }


      // Handle extra employees message
  
      // Handle extra employees message
    //   if (extraEmployees.length > 0) {
    //     setExtraEmployees(extraEmployees);
    //     setShowExtraOptions(true); // Show Yes/No options for extra employees
    //   }
  
    //   return; // Stop submission if there are discrepancies
    // }
  
    // Validate each timesheet entry
    // const invalidEntries = timeSheetData.map(entry => {

    const employeeMap = new Map(
      employeeData.map((emp) => [
        emp.empId, 
        `${emp.firstName} ${emp.lastName}`.trim()
      ])
    );

    const timesheetEmployeeIds = timeSheetData.map((entry) => String(entry.empId));
    console.log('timesheetEmployeeIds:',timesheetEmployeeIds)

    const employeeSet = new Set(employeeData.map((emp) => emp.empId));
    const timesheetEmployeeSet = new Set(timeSheetData.map((entry) => String(entry.empId)));

    console.log('Employee Set:', employeeSet);
    console.log('Timesheet Employee Set:', timesheetEmployeeSet);
  
    const missingEmployees = [...employeeSet].filter((empId) => !timesheetEmployeeSet.has(empId));
    console.log('Missing Employees:', missingEmployees);

    const extraEmployees = [...timesheetEmployeeSet].filter((empId) => !employeeSet.has(empId));
    console.log('Extra Employees:', extraEmployees);

    if (missingEmployees.length > 0 || extraEmployees.length > 0) {
      if (missingEmployees.length > 0) {
        setMissingEmployees(missingEmployees); 
        setShowMissingOptions(true); 
      }

      if (extraEmployees.length > 0) {
        setExtraEmployees(extraEmployees); 
        setShowExtraOptions(true); 
      }

      return; 
    }

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
  
      const isEmpNameValid = employeeMap.get(String(entry.empId)) === entry.name;

      return {
        entry,
        isDaysValid,
        isAttendanceValid,
        isAttendanceLopValid,
        isEmpIdValid,
        isEmpNameValid,

      };
  
    }).filter((validation) => !validation.isDaysValid || !validation.isAttendanceValid || !validation.isAttendanceLopValid || !validation.isEmpIdValid|| 
    !validation.isEmpNameValid);

    if (invalidEntries.length > 0) {
      const messages = invalidEntries.map(({ entry, isDaysValid, isAttendanceValid, isAttendanceLopValid, isEmpIdValid, isEmpNameValid}) => {
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
  
        if (!isEmpNameValid) {
          message += `EmpName mismatch for empId ${entry.empId}: expected '${employeeMap.get(String(entry.empId))}', got '${entry.name}'. `;
        }

        return message;
      });
  
      setErrorMessages(messages);
      return;
    }
  
    console.log("Original Month Data:", timeSheetData); // Log the original data

    const updatedTimeSheetData = timeSheetData.map(entry => {
      const formattedMonth = formatMonthToMMYYYY(entry.month);
      console.log("Formatted Month:", formattedMonth); // Log the formatted month
      return {
        ...entry,
        month: formattedMonth,
        company: companyId,
      };
    });
    
    console.log("Updated TimeSheet Data Before Upload:", updatedTimeSheetData); // Log the final data

    // Store the month value (you can take the month from the first entry or use your logic)
    if (updatedTimeSheetData.length > 0) {
      localStorage.setItem('month', updatedTimeSheetData[0].month); // Save the first entry's month
    }


  
    // If all validations pass, submit the timesheet data
    // try {
    //   const response = await fetch('http://127.0.0.1:8000/timesheet/upload/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(updatedTimeSheetData),
    //   });
  
    //   if (response.ok) {
    //     setSuccessMessage('Data uploaded successfully!');
    //   } else {
    //     const data = await response.json();
    //     setErrorMessages([data.message || 'Error uploading data.']);
    //   }
    // } catch (error) {
    //   console.error('Error uploading data:', error);
    //   setErrorMessages(['There was an error in submitting your data.']);
    // }
    // };
    try {
      console.log("HELLO SUVARNA")
      const response = await api.post('/api/timesheet/upload/', updatedTimeSheetData, {
        headers: {
          'Content-Type': 'application/json', // Ensure the content type is JSON
        },
      });
    
      if (response.status === 200) {
        setSuccessMessage('Data uploaded successfully!');
      } else {
        setErrorMessages([response.data.message || 'Error uploading data.']);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      setErrorMessages(['There was an error in submitting your data.']);
    }
  };
  



  //     .then((response) => response.json())
  //     .then((data) => {
  //       alert('Data uploaded successfully!');
  //     })
  //     .catch((error) => {
  //       console.error('Error uploading data:', error);
  //     });
  // };

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
    setShowExtraOptions(false); 
  };

  // const savePayData = async () => {

  //   console.log("Payload to be sent:", calculatedData);

  //   try {
  //     const response = await axios.post(
  //       'http://127.0.0.1:8000/api/save-pay-data/', 
  //       calculatedData
  //     );
  
  //     console.log('Data saved successfully:', response.data);
  //     setSuccessMessage('Pay data saved successfully!');
  //   } catch (error) {
  //     console.error('Error saving pay data:', error);
  //     setErrorMessages(['Error saving pay data. Please try again.']);
  //   }
  // };
  const savePayData = async () => {
    try {

      for (const entry of calculatedData) {
       
        const response = await api.post('/api/save-pay-data/', entry, {
          headers: {
            'Content-Type': 'application/json', // Ensure content type is JSON
          },
        });
        // const response = await axios.post(
        //   'http://127.0.0.1:8000/api/save-pay-data/', 
        //   entry 
        // );
        console.log('Data saved successfully:', response.data);
      }
      setSuccessMessage('Pay data saved successfully!');
    } catch (error) {
      console.error('Error saving pay data:', error);
      setErrorMessages(['Error saving pay data. Please try again.']);
    }
  };
  

  return (
    <div>
     <Navbar />
      <div className="timesheet-container">
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <div className="step-content">
            <h2>Step 1: Download Excel Template</h2>
            
            <div className="button-group">
              <Button onClick={downloadTemplate} variant="contained">Download Template</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ mt: 2 }}  
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {activeStep === 1 && (
          <div className="step-content">
            <h2>Step 2: Upload Attendance Sheet</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="upload-button" />
            {timeSheetData.length > 0 && (
              <>
                <h2>Time Sheet Data</h2>
                <table>
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Emp ID</th>
                      <th>Name</th>
                      <th>Month</th>
                      <th>No. of Days</th>
                      <th>Attendance</th>
                      <th>LOP Days</th>
                      <th>OT</th>
                      <th>Allowance</th>
                      <th>Deductions</th>
                      </tr>
                </thead>
                <tbody>
                  {timeSheetData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.sno}</td>
                      <td>{entry.empId}</td>
                      <td>{entry.name}</td>
                      <td>{entry.month}</td>
                      <td>{entry.noOfDays}</td>
                      <td>{entry.attendance}</td>
                      <td>{entry.lopDays}</td>
                      <td>{entry.OT}</td>
                      <td>{entry.allowance}</td>
                      <td>{entry.deductions}</td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Button Group for Back and Submit */}
            <div className="button-group-two">
              <Button onClick={handleBack} variant="contained" sx={{ mr: 3 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button 
                variant="contained"
                sx={{ mr: 3 }}
                color="primary"
                onClick={handleNext}
                // sx={{ mt: 2 }}  // Adds margin-top for spacing
              >
                Next
              </Button>
            </div>

            {/* <div>
              {errorMessages.length > 0 && (
                <div className="error-messages">
                  <ul>
                    {errorMessages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {successMessage && (
                <div className="success-message">
                  <p>{successMessage}</p>
                </div>
              )}

            </div> */}
<div>
  {/* Error message block */}
  {errorMessages.length > 0 && (
    <div className="error-messages" style={{ color: 'red' }}>
      {errorMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  )}

  {/* Success message block */}
  {successMessage && (
    <div className="success-message" style={{ color: 'green' }}>
      <p>{successMessage}</p>
    </div>
  )}

  {/* Your form or other components */}
</div>

           
          </div>
        )}

        {activeStep === 2 && (
          <div className="step-content">
            <h2>Step 3: Review and Calculate Pay</h2>
            
            <div className="timesheet-table">
              <h2>Timesheet Data</h2>
              <table>
                <thead>
                  <tr>
                    <th>SNO</th>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Month</th>
                    <th>No. of Days</th>
                    <th>Attendance</th>
                    <th>OT</th>
                    <th>LOP Days</th>
                    <th>Salary</th>
                    <th>Basic</th>
                    <th>DA</th>
                    <th>HRA</th>
                    {/* Add dynamic reimbursement headers
                    {dynamicHeaders.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))} */}
                    <th>Special Allowance</th>
                    <th>Gross Pay</th>
                    <th>OT Pay</th>
                    <th>Allowance</th>
                    <th>Total Pay</th>
                    <th>EE PF</th>
                    <th>ESI</th>
                    <th>PT</th>
                    <th>Deductibles & Loans</th>
                    <th>This month Deductions</th>
                    <th>Net Pay</th>
                  </tr>
                </thead>
                  <tbody>
                    {calculatedData.map((entry, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{entry.empId}</td>
                        <td>{entry.name}</td>
                        <td>{entry.month}</td>
                        <td>{entry.no_of_days}</td>
                        <td>{entry.attendance}</td>
                        <td>{entry.OT}</td>
                        <td>{entry.lop_days}</td>
                        <td>{entry.salary}</td>
                        <td>{entry.basic}</td>
                        <td>{entry.da}</td>
                        <td>{entry.hra}</td>
                        {/* Display dynamic reimbursement values */}
                        {/* {dynamicHeaders.map((header, index) => (
                          <td key={index}>{entry.reimbursements?.[header] || '-'}</td>
                        ))} */}
                        <td>{entry.special_allowance}</td>
                        <td>{entry.grossPay}</td>
                        <td>{entry.otPay}</td>
                        <td>{entry.allowance}</td>
                        <td>{entry.totalPay}</td>
                        <td>{entry.eePF}</td>
                        <td>{entry.esi}</td>
                        <td>{entry.pt}</td>
                        <td>{entry.deductiblesLoans}</td>
                        <td>{entry.deductions}</td>
                        <td>{entry.net_pay}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="button-group-two">
              <Button onClick={handleBack} variant="contained" sx={{ mr: 2 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={savePayData} // Make sure to handle the submission of this data appropriately
              >
                Submit
              </Button>
            </div>
          </div>
        )}


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
