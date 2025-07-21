import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthProvider } from '../../hook/use-auth-provider.js';
import cleaningIcon from '../../assets/cleaning-icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCog,
  faSignOutAlt,
  faTachometerAlt,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import LoginPanel from '../LoginPanel/LoginPanel.jsx';
import './Header.css';

const Header = () => {
  const { user, signOut, initializing } = useAuthProvider();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginPanelOpen, setLoginPanelOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setLoginPanelOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const navigationLinks = [
    { to: '/', label: 'Home', isActive: true },
    { to: '/services', label: 'Services' },
    { to: '/teams', label: 'Teams' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <header className="header">
        <div className="header-content">
          {/* Logo Section */}
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <img src={cleaningIcon} alt="CleanMaster Logo" className="brand-logo" />
              <div className="brand-text">
                <h1>CleanMaster</h1>
                <span className="brand-tagline">Professional Cleaning</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="main-nav desktop-nav">
            <ul>
              {navigationLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`nav-link ${link.isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Section */}
          <div className="auth-nav">
            {!initializing ? (
              <>
                {user ? (
                  <div className="user-dropdown" ref={dropdownRef}>
                    <div className="user-button-container">
                      <button
                        className={`user-icon-btn ${dropdownOpen ? 'active' : ''}`}
                        onClick={toggleDropdown}
                        aria-expanded={dropdownOpen}
                        aria-label="User menu"
                      >
                        <div className="user-icon-wrapper">
                          <FontAwesomeIcon icon={faUser} className="user-icon" />
                          <div className="user-icon-ring"></div>
                        </div>
                      </button>
                    </div>

                    {dropdownOpen && (
                      <div className="dropdown-menu">
                        <div className="dropdown-header">
                          <div className="user-info">
                            <div className="user-avatar">
                              <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="user-details">
                              <span className="user-name">{user.displayName || 'User'}</span>
                              <span className="user-email">{user.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <div className="dropdown-item">
                          <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                            <FontAwesomeIcon icon={faTachometerAlt} />
                            <span>Dashboard</span>
                          </Link>
                        </div>

                        <div className="dropdown-item">
                          <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                            <FontAwesomeIcon icon={faCog} />
                            <span>Settings</span>
                          </Link>
                        </div>

                        <div className="dropdown-divider"></div>

                        <div className="dropdown-item logout-item">
                          <button className="dropdown-link" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button className="btn btn-primary login-btn" onClick={handleLoginClick}>
                    <span>Sign In</span>
                  </button>
                )}
              </>
            ) : (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul>
            {navigationLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`nav-link ${link.isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu-backdrop"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}
      </header>

      {/* Login Panel - Moved outside header to avoid z-index inheritance */}
      <LoginPanel
        isOpen={loginPanelOpen}
        onClose={() => setLoginPanelOpen(false)}
      />
    </>
  );
};

export default Header;