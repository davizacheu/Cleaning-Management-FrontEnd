// Modified Header.jsx - Better approach
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/useAuthHook.js';
import cleaningIcon from '../../assets/cleaning-icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ onLoginClick }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const authStatus = isAuthenticated(); // Store the result in a variable


  const handleLoginClick = (e) => {
    e.preventDefault();
    onLoginClick(e);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Reset dropdown state when auth status changes
  useEffect(() => {
    setDropdownOpen(false);
  }, [authStatus]);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img src={cleaningIcon} alt="CleanMaster Logo" className="brand-logo" />
            <h1>CleanMaster</h1>
          </div>

          <div className="nav-links">
            <ul>
              <li><Link to="/" className="active">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/teams">Teams</Link></li>
            </ul>
          </div>

          <nav className="nav">
            <ul>
              {isAuthenticated() ? (
                  <li className="user-dropdown" ref={dropdownRef}>
                    <button
                        className="user-icon-btn"
                        onClick={toggleDropdown}
                        aria-expanded={dropdownOpen}
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                          <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                            <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                          </Link>
                          <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                            <FontAwesomeIcon icon={faCog} /> Settings
                          </Link>
                          <div className="dropdown-link" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                          </div>
                        </div>
                    )}
                  </li>
              ) : (
                  <li>
                    <button className="btn btn-primary" onClick={handleLoginClick}>
                      Login
                    </button>

                  </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
  );
};

export default Header;
