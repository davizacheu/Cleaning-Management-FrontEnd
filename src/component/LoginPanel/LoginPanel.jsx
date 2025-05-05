
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
  const scrollPositionRef = useRef(0);
  const scrollbarWidthRef = useRef(0);

  // Effect to disable scrolling when the panel is open
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width by comparing window inner width to document client width
      scrollbarWidthRef.current = window.innerWidth - document.documentElement.clientWidth;

      // Store the current scroll position before freezing
      scrollPositionRef.current = window.scrollY;

      // Add padding to the right of the body to prevent content shift
      document.body.style.paddingRight = `${scrollbarWidthRef.current}px`;

      // Apply the scroll lock styles
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.classList.add('login-panel-open');
    } else {
      // Remove the scroll lock styles
      document.body.classList.remove('login-panel-open');

      // Remove the padding
      document.body.style.paddingRight = '';

      // Restore the scroll position
      window.scrollTo(0, scrollPositionRef.current);
      document.body.style.top = '';
    }

    // Cleanup function
    return () => {
      if (document.body.classList.contains('login-panel-open')) {
        document.body.classList.remove('login-panel-open');
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollPositionRef.current);
        document.body.style.top = '';
      }
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
      <div className={`login-panel ${isOpen ? 'open' : ''}`}>
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
      </div>
  );
};

export default LoginPanel;