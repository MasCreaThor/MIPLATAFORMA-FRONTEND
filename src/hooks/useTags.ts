// src/hooks/useTags.ts
import { useQuery, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TagsFilter {
  search?: string;
  minUsageCount?: number;
  popular?: boolean;
  limit?: number;
}

export interface TagsHookResult {
  tags: Tag[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Tag[], Error>>;
  authError: boolean;
}

const fetchTags = async (filters: TagsFilter = {}): Promise<Tag[]> => {
  try {
    const response = await apiClient.get('/tags', { params: filters });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
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

export function useTags(filters: TagsFilter = {}): TagsHookResult {
  const [tokenExists, setTokenExists] = useState<boolean>(false);
  
  // Verificar si existe el token en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setTokenExists(!!token);
  }, []);

  const queryResult = useQuery({
    queryKey: ['tags', filters],
    queryFn: () => fetchTags(filters),
    enabled: tokenExists,
    retry: 1,
  });

  return {
    tags: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    authError: !tokenExists,
  };
}