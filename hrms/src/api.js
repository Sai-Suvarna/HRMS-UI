

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
// require('dotenv').config();

// const apiUrl = "http://127.0.0.1:8000";
const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
// const apiUrl = process.env.REACT_APP_API_URL

// console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);


// const api = axios.create({
//     baseURL: "http://127.0.0.1:8000", // Test with this hardcoded value
// });

// const api = axios.create({
//   baseURL: process.env.VITE_API_URL ,
// });

const api = axios.create({
  baseURL: apiUrl ,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;