// src/services/authService.ts
import apiClient from '../lib/api/apiClient';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: RegisterDto) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};