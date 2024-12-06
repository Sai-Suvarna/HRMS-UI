// src/utils/apiHelpers.js
import api from "../api";
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from "../constants";


/**
 * Fetches the user ID from the JWT access token stored in localStorage.
 * @returns {Promise<string | null>} - The user ID or null if not found.
 */
export const fetchUserId = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        console.log("User ID:", userId);
        return userId;
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
      }
    } else {
      console.error('No access token found in localStorage');
      return null;
    }
  };


/**
 * Fetches the role from the JWT access token stored in localStorage.
 * @returns {Promise<string | null>} - The role or null if not found.
 */
export const fetchRole = async () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role; // Assuming the role is stored in the token
      console.log("Role:", role);
      return role;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  } else {
    console.error('No access token found in localStorage');
    return null;
  }
};
  

/**
 * Fetches the company ID for a given user ID.
 * @param {string | number} userId - The ID of the user.
 * @returns {Promise<string | null>} - The company ID or null if not found.
 */
export const fetchCompanyId = async (userId) => {
    const url = `/api/companyid/${userId}/`;
    try {
    const response = await api.get(url);

     // Check for a successful response (status code 200)
    if (response.status === 200) {
        const data = response.data;
        console.log("Company ID:", data.companyId);
        return data.companyId;
      } else {
        console.error("Error fetching company ID: Unexpected status", response.status);
        return null;
      }
    } catch (error) {
      console.error("Network error:", error);
      return null;
    }
  };
  

/**
 * Fetches the company ID for a given user ID.
 * @param {string | number} userId - The ID of the user.
 * @returns {Promise<string | null>} - The company ID or null if not found.
 */
export const fetchUserName = async (userId) => {
  const url = `/api/username/${userId}/`;
  try {
  const response = await api.get(url);

   // Check for a successful response (status code 200)
  if (response.status === 200) {
      const data = response.data;
      console.log("User Name:", data.username);
      return data.username;
    } else {
      console.error("Error fetching User Name: Unexpected status", response.status);
      return null;
    }
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
};



// import api from "../api";
// import { jwtDecode } from 'jwt-decode';
// import { ACCESS_TOKEN } from "../constants";

// /**
//  * Fetches the user ID from the JWT access token stored in localStorage.
//  * @returns {Promise<string | null>} - The user ID or null if not found.
//  */
// export const fetchUserId = async () => {
//   const token = localStorage.getItem(ACCESS_TOKEN);
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       const userId = decodedToken.user_id;
//       console.log("User ID:", userId);
//       return userId;
//     } catch (error) {
//       console.error('Error decoding JWT token:', error);
//       return null;
//     }
//   } else {
//     console.error('No access token found in localStorage');
//     return null;
//   }
// };

// /**
//  * Fetches the role from the JWT access token stored in localStorage.
//  * @returns {Promise<string | null>} - The role or null if not found.
//  */
// export const fetchRole = async () => {
//   const token = localStorage.getItem(ACCESS_TOKEN);
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       const role = decodedToken.role; // Assuming the role is stored in the token
//       console.log("Role:", role);
//       return role;
//     } catch (error) {
//       console.error('Error decoding JWT token:', error);
//       return null;
//     }
//   } else {
//     console.error('No access token found in localStorage');
//     return null;
//   }
// };

// /**
//  * Fetches the company ID for a given user ID and role.
//  * @param {string | number} userId - The ID of the user.
//  * @param {string} role - The role of the user.
//  * @returns {Promise<string | null>} - The company ID or null if not found.
//  */
// export const fetchCompanyId = async (userId, role) => {
//   const url = `/api/companyid/${userId}`;  // Pass the role as a query parameter
//   try {
//     const response = await api.get(url);

//     if (response.status === 200) {
//       const data = response.data;
//       console.log("Company ID:", data.companyId);
//       return data.companyId;
//     } else {
//       console.error("Error fetching company ID: Unexpected status", response.status);
//       return null;
//     }
//   } catch (error) {
//     console.error("Network error:", error);
//     return null;
//   }
// };
