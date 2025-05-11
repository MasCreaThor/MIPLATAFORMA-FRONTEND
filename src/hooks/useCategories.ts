// src/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data.data || response.data;
};

export function useCategories() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return {
    categories: data,
    isLoading,
    error,
    refetch,
  };
}