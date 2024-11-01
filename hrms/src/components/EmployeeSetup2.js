import Navbar from './Navbar';
import axios from 'axios';
// import { Form, Input, DatePicker, Select, message, Tabs, Divider } from 'antd';
import moment from 'moment';
import './EmployeeSetup.css'; 
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';


const { Option } = Select;

const steps = [
  'Work Details',
  'Social Security Details',
  'Personal Details',
  'Insurance Details',
  'Salary Details',
];