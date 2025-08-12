import { apiClient } from "./apiClient";

async function register(userData) {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

async function login(credentials) {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

const authService = {
  register,
  login,
};

export default authService;