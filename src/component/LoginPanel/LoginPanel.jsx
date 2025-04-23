// src/component/LoginPanel.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/useAuthHook.js';
import { validateUsername, validatePassword } from '../../utils/user_validation_utils.js';
import './LoginPanel.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons"; // Import the component-specific CSS

const LoginPanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Add this hook for navigation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error: authError } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError) newErrors.username = usernameError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(`Attempting login with username: ${username}`);
      await login(username, password);
      console.log("Login successful, clearing form");
      setUsername('');
      setPassword('');
      onClose();
      console.log("About to navigate to dashboard...");
      navigate('/dashboard');
      console.log("Navigation called");

    } catch (error) {
      console.error("Login exception:", error);
    } finally {
      setIsSubmitting(false);
      console.log("Login submission finished");
    }
  };

  return (
      <div className={`login-panel ${isOpen ? 'open' : ''}`}>
        <button className="x-close-btn close-login-panel" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="login-panel-content">
          <h2>Login to CleanMaster</h2>
          {authError && <div className="error-message">{authError}</div>}
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
              {errors.username && <div className="field-error">{errors.username}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default LoginPanel;