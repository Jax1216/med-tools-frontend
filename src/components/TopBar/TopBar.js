import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.png';
import authService from '../../services/authService';
import './TopBar.css';

const TopBar = () => {
  const history = useHistory();

  const handleLogout = () => {
    authService.logout();
    history.push('/login');
  };

  return (
    <header className="top-bar">
      <div className="logo">
        <img src={logo} alt="Keen Medical Group Logo" />
      </div>
      <nav className="buttons">
        <NavLink to="/patient" activeClassName="active-link">
          PATIENT
        </NavLink>
        <NavLink to="/practice" activeClassName="active-link">
          PRACTICE
        </NavLink>
         <NavLink to="/profile" activeClassName="active-link">
          PROFILE
        </NavLink>

      </nav>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </header>
  );
};

export default TopBar;