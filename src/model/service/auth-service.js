// src/model/service/auth-service.js
import { ApiCommunicator } from "../net/apiCommunicator.js";
import { handleLoginResponse } from "../net/responses.js";

export const authService = {
  async login(username, password) {
    try {
      const loginRequest = { username, password };
      const communicatorResponse = await ApiCommunicator.post('login', loginRequest);
      const token = handleLoginResponse(communicatorResponse);
      localStorage.setItem('auth_token', token);
      return token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await ApiCommunicator.delete('user/logout', true);
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

};