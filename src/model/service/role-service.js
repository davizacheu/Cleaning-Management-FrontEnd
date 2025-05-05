// src/model/service/role-service.js
import { handleUserRolesResponse, handleRoleDataResponse } from "../net/responses.js";
import {supabase} from "../net/supabase-client.js";
import {ApiCommunicator} from "../net/apiCommunicator.js";

export const roleService = {
  async getUserRoles(user_id) {
    try {
      const {data, error} = await supabase
          .from('roles')
          .select('*, company:companies!inner(*)')
          .eq('user_id', user_id)
      if (error) {
        console.error('Error fetching user roles:', error);
      }
      const response = data.map(({ company, ...role }) => ({ role, company }))
      return handleUserRolesResponse(response);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  },

  async getRoleData(roleId) {
    try {
      const response = await ApiCommunicator.get(`user/roles/${roleId}`, true);
      return handleRoleDataResponse(response);
    } catch (error) {
      console.error('Error fetching role data:', error);
      throw error;
    }
  },
  
  async addNewCompany(companyData) {
    try {
      const response = await ApiCommunicator.post('companies', companyData, true);
      return response;
    } catch (error) {
      console.error('Error adding company:', error);
      throw error;
    }
  },
  
  async joinCompany(roleId) {
    try {
      const response = await ApiCommunicator.post(`companies/join/${roleId}`, {}, true);
      return response;
    } catch (error) {
      console.error('Error joining company:', error);
      throw error;
    }
  }
};