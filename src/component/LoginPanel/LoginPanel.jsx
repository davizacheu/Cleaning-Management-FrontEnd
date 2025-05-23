import React, { useEffect, useRef, useState } from 'react';
import { useAuthProvider } from '../../hook/use-auth-provider.js';
import './LoginPanel.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faShieldAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faApple,
  faGithub,
  faFacebook
} from '@fortawesome/free-brands-svg-icons';

const LoginPanel = ({ isOpen, onClose }) => {
  const { signInWithProvider, error: authError, isLoading } = useAuthProvider();
  const panelRef = useRef(null);
  const firstButtonRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle visibility state for smooth transitions
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay hiding until slide-out animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 400); // Match the transition duration in CSS
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent scroll with scrollbar compensation
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Set CSS custom property for scrollbar width
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      
      // Add class to prevent scrolling
      document.body.classList.add('login-panel-open');
      
      // Focus management for accessibility
      if (firstButtonRef.current) {
        setTimeout(() => firstButtonRef.current.focus(), 100);
      }
    } else {
      document.body.classList.remove('login-panel-open');
      document.documentElement.style.removeProperty('--scrollbar-width');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('login-panel-open');
      document.documentElement.style.removeProperty('--scrollbar-width');
    };
  }, [isOpen]);

  // Handle keyboard navigation for accessibility
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Trap focus within the panel
    const handleTabKey = (event) => {
      if (!isOpen || event.key !== 'Tab') return;
      
      const focusableElements = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements?.length) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen, onClose]);

  const socialProviders = [
    { 
      name: 'google', 
      icon: faGoogle, 
      label: 'Continue with Google',
      handler: () => signInWithProvider('google'),
      color: '#DB4437',
      description: 'Use your Google account'
    },
    { 
      name: 'apple', 
      icon: faApple, 
      label: 'Continue with Apple',
      handler: () => console.log('Apple sign in not implemented yet'),
      color: '#000000',
      description: 'Use your Apple ID'
    },
    { 
      name: 'github', 
      icon: faGithub, 
      label: 'Continue with GitHub',
      handler: () => console.log('GitHub sign in not implemented yet'),
      color: '#171515',
      description: 'Use your GitHub account'
    },
    { 
      name: 'facebook', 
      icon: faFacebook, 
      label: 'Continue with Facebook',
      handler: () => console.log('Facebook sign in not implemented yet'),
      color: '#1877F2',
      description: 'Use your Facebook account'
    }
  ];

  const handleProviderClick = async (provider) => {
    if (isLoading) return;
    
    try {
      await provider.handler();
      // Panel will close automatically on successful auth
    } catch (error) {
      console.error(`${provider.name} login error:`, error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Enhanced Backdrop - Show during open and close transitions */}
      {isVisible && (
        <div 
          className={`login-panel-backdrop ${isOpen ? 'open' : 'closing'}`}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
      
      <aside 
        ref={panelRef}
        className={`login-panel ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal={isOpen}
        aria-labelledby="login-panel-title"
        aria-describedby="login-panel-description"
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      >
        {/* Enhanced Header */}
        <div className="login-panel-header">
          <button 
            className="x-close-btn close-login-panel" 
            onClick={onClose}
            aria-label="Close login panel"
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          
          <div className="login-panel-logo">
            <div className="login-logo-icon">
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <h2 id="login-panel-title">Welcome</h2>
            <p id="login-panel-description" className="login-panel-subtitle">
              Sign in to access your CleanMaster account
            </p>
          </div>
        </div>
        
        <div className="login-panel-content">
          {/* Enhanced Error Display */}
          {authError && (
            <div className="error-message" role="alert">
              <FontAwesomeIcon icon={faTimes} className="error-icon" />
              <div className="error-text">
                <strong>Sign in failed</strong>
                <span>{authError}</span>
              </div>
            </div>
          )}

          {/* Enhanced Social Login Section */}
          <div className="social-login-container">
            <div className="section-header">
              <h3>Choose your preferred method</h3>
              <p>Select a provider to continue</p>
            </div>

            <div className="social-providers">
              {socialProviders.map((provider, index) => (
                <button
                  key={provider.name}
                  ref={index === 0 ? firstButtonRef : null}
                  className={`social-login-btn ${provider.name}-btn ${isLoading ? 'loading' : ''}`}
                  onClick={() => handleProviderClick(provider)}
                  aria-label={provider.label}
                  disabled={isLoading}
                  style={{ '--provider-color': provider.color }}
                >
                  <div className="btn-icon">
                    <FontAwesomeIcon icon={provider.icon} />
                  </div>
                  <div className="btn-content">
                    <span className="btn-label">{provider.label}</span>
                    <span className="btn-description">{provider.description}</span>
                  </div>
                  <div className="btn-arrow">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  {isLoading && (
                    <div className="btn-loader">
                      <div className="spinner"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Terms Section */}
          <div className="login-terms">
            <FontAwesomeIcon icon={faShieldAlt} className="terms-icon" />
            <p>
              By continuing, you agree to CleanMaster's{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>.
            </p>
          </div>

          {/* Security Badge */}
          <div className="security-badge">
            <FontAwesomeIcon icon={faShieldAlt} />
            <span>Secured with industry-standard encryption</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default LoginPanel;