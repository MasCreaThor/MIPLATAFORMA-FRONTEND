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

// Variable para controlar si estamos en proceso de renovación de token
let isRefreshing = false;
// Cola de solicitudes pendientes para reintentar después de renovar el token
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor para añadir el token a las solicitudes
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Obtenemos el token del localStorage (solo en el cliente)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.debug("Token added to request:", config.url);
      } else if (!token) {
        console.debug("No token found for request:", config.url);
      }
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error("Request interceptor error:", error);
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

    // Si recibimos un 401 (No autorizado) y no estamos en un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya estamos renovando el token, poner esta solicitud en la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Obtenemos el refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          console.error("No refresh token available");
          throw new Error('No refresh token available');
        }

        console.log("Attempting to refresh token...");
        
        // Renovamos el token
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { access_token, refresh_token } = response.data;
        
        // Guardamos los nuevos tokens
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        console.log("Token refreshed successfully");
        
        // Actualizamos el header y procesamos la cola
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        processQueue(null, access_token);
        isRefreshing = false;
        
        return axios(originalRequest);
      } catch (refreshError) {
        // Si falla la renovación, limpiamos tokens y procesamos la cola con error
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        processQueue(refreshError as AxiosError);
        isRefreshing = false;
        
        if (typeof window !== 'undefined') {
          console.log("Redirecting to login page...");
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Para errores 400, mostrar más detalles para diagnóstico
    if (error.response?.status === 400) {
      console.error("Bad Request Details:", error.response.data);
      console.error("Request Parameters:", originalRequest.params);
    }

    return Promise.reject(error);
  }
);

export default apiClient;