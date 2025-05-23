
// src/component/LoginPanel.jsx
import React, { useEffect, useRef } from 'react';
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

  // Effect to disable scrolling when the panel is open
useEffect(() => {
  if (isOpen) {
    // Calculate scrollbar width to prevent content shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    
    // Add classes for styling and preventing scroll
    document.body.classList.add('login-panel-open');
    document.body.classList.add('compensate-scrollbar');
    
    // Still apply overflow hidden directly for compatibility
    document.body.style.overflow = 'hidden';
  } else {
    // Remove scroll prevention and scrollbar compensation immediately
    // This allows the scrollbar to appear right away as the panel slides
    document.body.classList.remove('login-panel-open');
    document.body.classList.remove('compensate-scrollbar');
    document.body.style.overflow = '';
    document.documentElement.style.removeProperty('--scrollbar-width');
  }

  return () => {
    // Clean up in case component unmounts while panel is open
    document.body.classList.remove('login-panel-open');
    document.body.classList.remove('compensate-scrollbar');
    document.body.style.overflow = '';
    document.documentElement.style.removeProperty('--scrollbar-width');
  };
}, [isOpen]);

  const handleGoogleSignIn = () => {
    try {
      signInWithProvider('google');
    } catch (error) {
      console.error("Google login exception:", error);
    }
  };


  // These would need implementation in AuthProvider
  const handleAppleSignIn = () => {
    console.log("Apple sign in not implemented yet");
    // Future implementation
  };

  const handleGithubSignIn = () => {
    console.log("GitHub sign in not implemented yet");
    // Future implementation
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook sign in not implemented yet");
    // Future implementation
  };

  return (
    <aside 
    className={`login-panel ${isOpen ? 'open' : ''}`}
    role="dialog"
    aria-modal={isOpen}
    aria-labelledby="login-panel-title"
  >
        <button className="x-close-btn close-login-panel" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="login-panel-content">
          <h2>Sign In / Up</h2>
          {authError && <div className="error-message">{authError}</div>}

          <div className="social-login-container">
            <p className="login-subtitle">Choose a sign in method</p>

            <button
                className="social-login-btn google-btn"
                onClick={handleGoogleSignIn}
            >
              <FontAwesomeIcon icon={faGoogle} />
              <span>Continue with Google</span>
            </button>

            <button
                className="social-login-btn apple-btn"
                onClick={handleAppleSignIn}
            >
              <FontAwesomeIcon icon={faApple} />
              <span>Continue with Apple</span>
            </button>

            <button
                className="social-login-btn github-btn"
                onClick={handleGithubSignIn}
            >
              <FontAwesomeIcon icon={faGithub} />
              <span>Continue with GitHub</span>
            </button>

            <button
                className="social-login-btn facebook-btn"
                onClick={handleFacebookSignIn}
            >
              <FontAwesomeIcon icon={faFacebook} />
              <span>Continue with Facebook</span>
            </button>
          </div>

          <p className="login-terms">
            By continuing, you agree to CleanMaster's Terms of Service and Privacy Policy.
          </p>
        </div>
      </aside>
  );
};

export default LoginPanel;