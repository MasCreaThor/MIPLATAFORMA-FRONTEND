// src/hooks/useCategories.ts
import { useQuery, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';

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

// Opciones para el hook
export interface CategoriesOptions {
  requireAuth?: boolean;  // Indica si se requiere autenticación para cargar categorías
}

export interface CategoriesHookResult {
  categories: Category[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Category[], Error>>;
  authError: boolean | undefined;
}

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/categories');
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
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

// Añadir opciones con valores predeterminados
export function useCategories(options: CategoriesOptions = { requireAuth: true }): CategoriesHookResult {
  const [tokenExists, setTokenExists] = useState<boolean>(false);
  
  // Verificar si existe el token en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setTokenExists(!!token);
  }, []);

  const queryResult = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    // Permitir cargar sin token si requireAuth es falso
    enabled: options.requireAuth ? tokenExists : true,
    retry: 1,
  });

  return {
    categories: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    // Indicar si hay un problema con la autenticación (solo si requireAuth es true)
    authError: options.requireAuth && !tokenExists,
  };
}