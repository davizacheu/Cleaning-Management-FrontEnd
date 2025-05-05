
// Modified Header.jsx - Better approach
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthProvider } from '../../hook/use-auth-provider.js';
import cleaningIcon from '../../assets/cleaning-icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import LoginPanel from '../LoginPanel/LoginPanel.jsx';
import './Header.css';

const Header = () => {
  const { user, signOut, initializing } = useAuthProvider();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginPanelOpen, setLoginPanelOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setLoginPanelOpen(true);
  };

  const handleLogout =  () => {
    signOut();
  };

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
      <nav className="header">
        <div className="header-content">

          <div className="logo-container">
            <Link to="/">
              <img src={cleaningIcon} alt="CleanMaster Logo" className="brand-logo" />
              <h1>CleanMaster</h1>
            </Link>
          </div>

          <div className="main-nav">
            <ul>
              <li><Link to="/" className="active">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/teams">Teams</Link></li>
            </ul>
          </div>

          <div className="auth-nav">
            {!initializing ?
                (<ul>
                      {user ? (
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
                                  <div className="dropdown-item">
                                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                                      <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                                    </Link>
                                  </div>
                                  <div className="dropdown-item">
                                    <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                                      <FontAwesomeIcon icon={faCog} /> Settings
                                    </Link>
                                  </div>
                                  <div className="dropdown-item">
                                    <button className="dropdown-link" onClick={handleLogout}>
                                      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                    </button>
                                  </div>
                                </div>
                            )}
                          </li>
                      ) : (
                          <li>
                            <button className="btn btn-primary" onClick={handleLoginClick}>
                              Sign In / Up
                            </button>
                          </li>
                      )}
                    </ul>
                ) : (
                    <></>
                )}
          </div>
        </div>

        {/* Login Panel */}
        <LoginPanel
            isOpen={loginPanelOpen}
            onClose={() => setLoginPanelOpen(false)}
        />
      </nav>
  );
};

export default Header;