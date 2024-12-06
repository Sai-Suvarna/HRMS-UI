// import React, { useState, useEffect } from "react";
// import { fetchUserId } from "../helpers/CompanyId";  
// import api from "../api";
// import Navbar from "../pages/Navbar";
// import { Container, Typography, Card, CardContent, Grid2, TextField } from "@mui/material";

// const EmployeeDetails = () => {
//   const [employeeDetails, setEmployeeDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const userId = await fetchUserId();
//         if (!userId) {
//           setError("User ID not found");
//           setLoading(false);
//           return;
//         }

//         const response = await api.get(`/api/employee/retrieve_employee/${userId}/`);
//         setEmployeeDetails(response.data);
//       } catch (err) {
//         setError("Error fetching employee details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   const excludeFields = (data) => {
//     // List of fields to exclude
//     const fieldsToExclude = ["company", "userId", "wdId", "ssdId", "pdId", "isdId", "sdId"];

//     // Iterate over each section and filter out the fields
//     for (let key in data) {
//       if (data[key] && typeof data[key] === "object") {
//         data[key] = Object.fromEntries(
//           Object.entries(data[key]).filter(([innerKey]) => !fieldsToExclude.includes(innerKey))
//         );
//       }
//     }
//     return data;
//   };

//   const renderDetailsWithTextField = (details) => {
//     const entries = Object.entries(details);
//     return (
//       <Grid2
//         container
//         spacing={2}
//         justifyContent="center"
//         alignItems="center"
//       >
//         {entries.map(([key, value], index) => (
//           <Grid2 item xs={4} key={index}>
//             <TextField
//               fullWidth
//               label={key}
//               value={value || ""}
//               InputProps={{
//                 readOnly: true,
//               }}
//               variant="outlined"
//             />
//           </Grid2>
//         ))}
//       </Grid2>
//     );
//   };

//   // Filter out unwanted fields from employeeDetails
//   const filteredDetails = employeeDetails ? excludeFields({ ...employeeDetails }) : null;

//   return (
//     <div>
//       <Navbar />
//       <Container>
//         <Card sx={{ marginBottom: 4, marginTop: 4, display: "flex", justifyContent: "center" }}>
//           <CardContent>
//             <Typography variant="h5" gutterBottom align="center" marginBottom="20px">
//               Work Details
//             </Typography>
//             {filteredDetails && renderDetailsWithTextField(filteredDetails.work_details)}
//           </CardContent>
//         </Card>

//         <Card sx={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>
//           <CardContent>
//             <Typography variant="h5" gutterBottom align="center">
//               Social Security Details
//             </Typography>
//             {filteredDetails && renderDetailsWithTextField(filteredDetails.social_security_details)}
//           </CardContent>
//         </Card>

//         <Card sx={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>
//           <CardContent>
//             <Typography variant="h5" gutterBottom align="center">
//               Personal Details
//             </Typography>
//             {filteredDetails && renderDetailsWithTextField(filteredDetails.personal_details)}
//           </CardContent>
//         </Card>

//         <Card sx={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>
//           <CardContent>
//             <Typography variant="h5" gutterBottom align="center">
//               Insurance Details
//             </Typography>
//             {filteredDetails && renderDetailsWithTextField(filteredDetails.insurance_details)}
//           </CardContent>
//         </Card>

//         <Card sx={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>
//           <CardContent>
//             <Typography variant="h5" gutterBottom align="center">
//               Salary Details
//             </Typography>
//             {filteredDetails && renderDetailsWithTextField(filteredDetails.salary_details)}
//           </CardContent>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default EmployeeDetails;


import React, { useState, useEffect } from "react";
import { fetchUserId } from "../helpers/CompanyId";  
import api from "../api";
import Navbar from "../pages/Navbar";
import { Container, Typography, Card, CardContent, Grid2, TextField } from "@mui/material";

// Field Mapping for camelCase to readable format
const fieldMapping = {
  empId: "Employee ID",
  firstName: "First Name",
  lastName: "Last Name",
  employmentStatus: "Employment Status",
  employmentType: "Employment Type",
  companyEmailId: "Company Email ID",
  dateOfJoining: "Date of Joining",
  dateOfRelieving: "Date of Relieving",
  group: "Group",
  department: "Department",
  roleType: "Role Type",
  currentRole: "Current Role",
  reportingManager: "Reporting Manager",
  reasonForLeaving: "Reason for Leaving",
  monthYearOfTermination: "Month and Year of Termination",
  totalExpInThisCompany: "Total Experience in this Company",
  totalExperience: "Total Experience",
  totalExpBeforeJoining: "Total Experience Before Joining",
  previousDateOfJoining: "Previous Date of Joining",
  previousEmployer: "Previous Employer",
  panNum: "PAN Number",
  uanNum: "UAN Number",
  aadharNum: "Aadhar Numer",
  bankName: "Bank Name",
  ifscCode: "IFSC Code",
  bankAccountNumber: "Bank Account Number",
  personalEmailId: "Personal Email ID",
  dob: "Date of Birth",
  gender: "Gender",
  educationalQualification: "Education Qualification",
  maritalStatus: "Marital Status",
  marriageDate: "Marriage Date",
  currentAddress: "Current Address",
  permanentAddress: "Permanent Address",
  generalContact: "General Contact",
  emergencyContact: "Emergency Contact",
  relationship: "Relationship",
  relationshipName: "Relationship Name",
  bloodGroup: "Blood Group",
  shirtSize: "Shirt Size",
  location: "Location",
  fathersName: "Father's Name",
  fathersDOB: "Father's DOB",
  mothersName: "Mother's Name",
  mothersDOB: "Mother's DOB",
  spouseName: "Spouse Name",
  spouseDOB: "Spouse DOB",
  child1: "Child1 Name",
  child1DOB: "Child1 DOB",
  child2: "Child2",
  child2DOB: "Child2 DOB",
  CTCpayAMT: "CTC Pay",
  BasicpayAMT: "Basic Pay",
  DApayAMT: "DA Pay",
  HRApayAMT: "HRA Pay",
  VariableAMT: "Variable Pay",
  QAllowanceAMT: "Quarterly Allowance",
  QBonusAMT: "Quarterly Bonus",
  ABonusAMT: "Annual Bonus",
  SAllowancesAMT: "Special Allowances",
  PTAMT: "Professional Tax",
  PFAMT: "Provident Fund",
  ESIAMT: "Employee State Insurance",
  DLoansAMT: "Deductions and Loans",
  AdvancesAMT: "Advances Amount",
  VPFAMT: "VPF Amount",
  // reimbursements: "Reimbursements",
  pf_type: "PF Type",
};

const EmployeeDetails = () => {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userId = await fetchUserId();
        if (!userId) {
          setError("User ID not found");
          setLoading(false);
          return;
        }

        const response = await api.get(`/api/employee/retrieve_employee/${userId}/`);
        setEmployeeDetails(response.data);
      } catch (err) {
        setError("Error fetching employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Function to exclude unwanted fields
  const excludeFields = (data) => {
    const fieldsToExclude = ["company", "userId", "wdId", "ssdId", "pdId", "isdId", "sdId", "reimbursements"];

    // const fieldsToExclude = ["wdId", "ssdId", "pdId", "isdId", "sdId"];
    for (let key in data) {
      if (data[key] && typeof data[key] === "object") {
        data[key] = Object.fromEntries(
          Object.entries(data[key]).filter(([innerKey]) => !fieldsToExclude.includes(innerKey))
        );
      }
    }
    return data;
  };

  // Function to convert camelCase to readable format using fieldMapping
  const formatFieldName = (field) => {
    return fieldMapping[field] || field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  };

  const renderDetailsWithTextField = (details) => {
    const entries = Object.entries(details);
    return (
      <Grid2
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {entries.map(([key, value], index) => (
          <Grid2 item xs={4} key={index}>
            <TextField
              fullWidth
              label={formatFieldName(key)}  // Use formatted field name
              value={value || ""}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid2>
        ))}
      </Grid2>
    );
  };

  const filteredDetails = employeeDetails ? excludeFields({ ...employeeDetails }) : null;

  return (
    <div>
      <Navbar />
      <Container>
        <Card sx={{ marginBottom: 4, marginTop: 4, display: "flex", justifyContent: "center" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" marginBottom="20px">
              Work Details
            </Typography>
            {filteredDetails && renderDetailsWithTextField(filteredDetails.work_details)}
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Social Security Details
            </Typography>
            {filteredDetails && renderDetailsWithTextField(filteredDetails.social_security_details)}
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Personal Details
            </Typography>
            {filteredDetails && renderDetailsWithTextField(filteredDetails.personal_details)}
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Insurance Details
            </Typography>
            {filteredDetails && renderDetailsWithTextField(filteredDetails.insurance_details)}
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: 4, display: "flex", justifyContent: "center" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Salary Details
            </Typography>
            {filteredDetails && renderDetailsWithTextField(filteredDetails.salary_details)}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default EmployeeDetails;
