import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:1337/api';

export const commandeService = {
  async createCommande(commandeData) {
    try {
      const user = authService.getCurrentUser();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.jwt}`,
        },
      };

      const response = await axios.post(
        `${API_URL}/commandes`, 
        { data: commandeData },
        config
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },

  async getCommandesByUser() {
    try {
      const user = authService.getCurrentUser();
      const config = {
        headers: {
          Authorization: `Bearer ${user?.jwt}`,
        },
      };

      const response = await axios.get(
        `${API_URL}/commandes?filters[user][id][$eq]=${user?.user?.id}&populate=*`,
        config
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  }
}; 