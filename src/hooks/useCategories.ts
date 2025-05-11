// src/hooks/useCategories.ts
import { useQuery, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios'; // Importamos AxiosError

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

// Definir la interfaz de retorno para incluir authError
export interface CategoriesHookResult {
  categories: Category[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Category[], Error>>;
  authError: boolean;
}

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/categories');
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Usamos el tipo AxiosError para manejar el error correctamente
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Status:", axiosError.response.status);
        console.error("Details:", axiosError.response.data);
      } else if (axiosError.request) {
        console.error("No response received");
      } else {
        console.error("Request error:", axiosError.message);
      }
    }
    throw error;
  }
};

export function useCategories(): CategoriesHookResult {
  const [tokenExists, setTokenExists] = useState<boolean>(false);
  
  // Verificar si existe el token en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setTokenExists(!!token);
  }, []);

  const queryResult = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    // Solo habilitar la consulta si existe un token
    enabled: tokenExists,
    retry: 1, // Limitar los reintentos en caso de error
  });

  return {
    categories: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    // Indicar si hay un problema con la autenticación
    authError: !tokenExists,
  };
}