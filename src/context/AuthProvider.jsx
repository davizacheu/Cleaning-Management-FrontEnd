// AuthProvider.jsx
import React, {useState} from 'react';
import {userService} from '../model/service/userService.js';
import {AuthContext} from "./AuthContext.jsx";

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);

      // Make API call and get response with token
      await userService.login(username, password);

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Failed to login');
      throw err;

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
      setError(null);
      setLoading(true);
      userService.logout().catch(
          (err) => {
            console.error("Logout error:", err);
            setError(err.message || 'Failed to logout');
            throw err;
          }).finally(() => {
        setLoading(false);
      })

  };

  // Function to fetch user roles with the token
  const getUserRoles = async () => {
    try {
      setLoading(true);
        // This will return objects of type {id, company_name, title, profile_pic}
        return await userService.getUserRoles();
    } catch (err) {
      console.error("Error fetching user roles:", err);
      setError(err.message || "Failed to load user roles");
      throw err;

    } finally {
      setLoading(false);
    }
  };


// Function to fetch user requests
  const getUserOrders = async () => {
    try {
      setLoading(true);
      // Fetch user requests using userService
      return await userService.getUserOrders();
    } catch (err) {
      console.error("Error fetching user requests:", err);
      setError(err.message || "Failed to fetch user requests");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Modified addUserRole function for AuthProvider.jsx
  const addNewCompany = async (companyData) => {
    try {
      setLoading(true);
      // Use the proper implementation from userService
      return await userService.addNewCompany(companyData);
    } catch (err) {
      console.error("Error adding user role:", err);
      setError(err.message || "Failed to add role");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinCompany = async (roleId) => {
      try {
        setLoading(true);
        return await userService.joinCompany(roleId);
      } catch (err) {
        console.error("Error joining company:", err);
        setError(err.message || "Failed to join company");
        throw err;
      } finally {
        setLoading(false);
      }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('auth_token');
  };

  return (
      <AuthContext.Provider value={{
        isAuthenticated: isAuthenticated,
        getUserRoles,
        getUserOrders,
        addNewCompany,
        joinCompany,
        login,
        logout,
        loading,
        error
      }}>
        {children}
      </AuthContext.Provider>
  );
};

export default AuthProvider;