// src/utils/validation.js
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'Username is required';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
};