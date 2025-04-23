import {ApiCommunicator} from "../net/apiCommunicator.js";
import {handleLoginResponse, handleUserRolesResponse, handleUserOrdersResponse} from "../net/responses.js";

export const userService = {

  async login(username, password) {
    try {
      // Create a properly formatted login request object
      const loginRequest = {
        username: username,
        password: password,
      };

      // Use ApiCommunicator for the request
      const communicatorResponse = await ApiCommunicator.post('login', loginRequest);
      console.log('communicator response: ', communicatorResponse)

      // Create a LoginResponse object from the API response
      const token = handleLoginResponse(communicatorResponse);

      // Store only the token
      localStorage.setItem('auth_token',token);

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Add this function to the userService object
  async getUserRoles() {
    try {
      // Make an authenticated request to fetch user roles
      const response = await ApiCommunicator.get('user/roles', true);
      console.log('service response: ', response)
      return handleUserRolesResponse(response);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  },

  async getUserOrders() {
    try {
      // Make an authenticated request to fetch user requests
      const response = await ApiCommunicator.get('user/orders', true);
      console.log('service response: ', response)
      return handleUserOrdersResponse(response);
    } catch (error) {
      console.error('Error fetching user requests:', error);
      throw error;
    }
  },

  async addNewCompany(companyData) {

  },

  async joinCompany(roleId){

  },

  async logout() {
    localStorage.removeItem('auth_token');
    // Fire and forget - don't await the API call
    ApiCommunicator.delete('user/logout', true).catch(error => {
      console.error('Logout API call failed:', error);
      throw error;
    });
  },

};