// // src/components/Navbar.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Navbar.css';  // Add styling here

// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">
//         <h1>HRMS</h1>
//       </div>
//       <ul className="navbar-links">
//         <li>
//           <Link to="/">Home</Link>
//         </li>
//         <li>
//           <Link to="/Home">Dashboard</Link>
//         </li>
//         <li>
//           <Link to="/login">Login</Link>
//         </li>
//         <li>
//           <Link to="/register">Register</Link>
//         </li>
//         <li>
//           <Link to="/logout">Logout</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;


// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';  // Add styling here

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all local storage data
    localStorage.clear();
    // Redirect to login page (or any desired page after logout)
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>HRMS</h1>
      </div>
      <ul className="navbar-links">
        {/* <li>
          <Link to="/">Home</Link>
        </li> */}
        <li>
          <Link to="/Home">Dashboard</Link>
        </li>
        {/* <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li> */}
        <li>
          {/* Add onClick to handle logout */}
          <Link to="/login" onClick={handleLogout}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
