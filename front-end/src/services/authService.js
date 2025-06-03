import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

export const authService = {
  async login(identifier, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/local`, {
        identifier,
        password,
      });
      
      if (response.data.jwt) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },

  async register(username, email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/local/register`, {
        username,
        email,
        password,
      });
      
      if (response.data.jwt) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user?.jwt;
  }
};