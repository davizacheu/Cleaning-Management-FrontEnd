import React, { useEffect } from 'react';
import { useAuthProvider } from '../../hook/use-auth-provider.js';
import './LoginPanel.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faApple,
  faGithub,
  faFacebook
} from '@fortawesome/free-brands-svg-icons';

const LoginPanel = ({ isOpen, onClose }) => {
  const { signInWithProvider, error: authError } = useAuthProvider();

  // Prevent scroll with scrollbar compensation
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Set CSS custom property for scrollbar width
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      
      // Add class to prevent scrolling
      document.body.classList.add('login-panel-open');
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

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const socialProviders = [
    { 
      name: 'google', 
      icon: faGoogle, 
      label: 'Continue with Google',
      handler: () => signInWithProvider('google')
    },
    { 
      name: 'apple', 
      icon: faApple, 
      label: 'Continue with Apple',
      handler: () => console.log('Apple sign in not implemented yet')
    },
    { 
      name: 'github', 
      icon: faGithub, 
      label: 'Continue with GitHub',
      handler: () => console.log('GitHub sign in not implemented yet')
    },
    { 
      name: 'facebook', 
      icon: faFacebook, 
      label: 'Continue with Facebook',
      handler: () => console.log('Facebook sign in not implemented yet')
    }
  ];

  const handleProviderClick = async (provider) => {
    try {
      await provider.handler();
    } catch (error) {
      console.error(`${provider.name} login error:`, error);
    }
  };

  return (
    <>
      {/* Backdrop for better UX */}
      {isOpen && (
        <div 
          className="login-panel-backdrop" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={`login-panel ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal={isOpen}
        aria-labelledby="login-panel-title"
        aria-hidden={!isOpen}
      >
        <button 
          className="x-close-btn close-login-panel" 
          onClick={onClose}
          aria-label="Close login panel"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="login-panel-content">
          <h2 id="login-panel-title">Sign In / Up</h2>
          
          {authError && (
            <div className="error-message" role="alert">
              {authError}
            </div>
          )}

          <div className="social-login-container">
            <p className="login-subtitle">Choose a sign in method</p>

            {socialProviders.map((provider) => (
              <button
                key={provider.name}
                className={`social-login-btn ${provider.name}-btn`}
                onClick={() => handleProviderClick(provider)}
                aria-label={provider.label}
              >
                <FontAwesomeIcon icon={provider.icon} />
                <span>{provider.label}</span>
              </button>
            ))}
          </div>

          <p className="login-terms">
            By continuing, you agree to CleanMaster's Terms of Service and Privacy Policy.
          </p>
        </div>
      </aside>
    </>
  );
};

export default LoginPanel;