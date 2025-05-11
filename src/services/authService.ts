// src/services/authService.ts
import apiClient from '../lib/api/apiClient';

// Definir la interfaz RegisterDto
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Definir las interfaces para las respuestas de autenticación
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: any;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
  
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};