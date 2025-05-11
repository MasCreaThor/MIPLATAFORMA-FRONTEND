// src/lib/api/apiClient.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Extendemos la interfaz InternalAxiosRequestConfig para añadir _retry
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Obtenemos la base URL desde variables de entorno
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Creamos la instancia de Axios con la configuración base
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos
});

// Interceptor para añadir el token a las solicitudes
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Obtenemos el token del localStorage (solo en el cliente)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // Intentar renovar el token si recibimos un 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Obtenemos el refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Renovamos el token
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { access_token, refresh_token } = response.data;
        
        // Guardamos los nuevos tokens
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        
        // Actualizamos el header y reintentamos la solicitud
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Si falla la renovación, limpiamos tokens y redirigimos al login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;