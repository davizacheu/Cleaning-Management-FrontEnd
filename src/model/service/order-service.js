// src/model/service/orderService.js
import { ApiCommunicator } from "../net/apiCommunicator.js";
import { handleUserOrdersResponse } from "../net/responses.js";
import { supabase} from "../net/supabase-client.js";

export const orderService = {

  async getUserOrders(user_id) {
    try {
      const {data, error} = await supabase
          .from('orders')
          .select('*, company:companies!left(*)')
          .eq('user_id', user_id);
      if (error) {
        console.error('Error fetching user orders:', error);
      }
      console.log('Orders data', data)
      const response = data.map(({ company, ...order }) => ({company, order}))
      return handleUserOrdersResponse(response);

    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },


  
  // Add more order-related methods as needed
  async addOrder() {

  }
};