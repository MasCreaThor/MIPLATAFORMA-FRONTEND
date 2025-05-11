// src/hooks/useTags.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';

interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TagsFilter {
  search?: string;
  minUsageCount?: number;
  popular?: boolean;
  limit?: number;
}

const fetchTags = async (filters: TagsFilter = {}): Promise<Tag[]> => {
  const response = await apiClient.get('/tags', { params: filters });
  return response.data.data || response.data;
};

export function useTags(filters: TagsFilter = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tags', filters],
    queryFn: () => fetchTags(filters),
  });

  return {
    tags: data,
    isLoading,
    error,
    refetch,
  };
}