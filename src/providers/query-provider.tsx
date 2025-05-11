// src/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// src/hooks/useResources.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceService } from '@/services/resourceService';
import { Resource } from '@/types/resource';

// Hook para obtener recursos
export function useResources(filters = {}) {
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: () => resourceService.getResources(filters),
  });
}

// Hook para obtener un recurso específico
export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourceService.getResourceById(id),
    enabled: !!id,
  });
}

// Hook para crear un recurso
export function useCreateResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Resource>) => resourceService.createResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

// Hook para actualizar un recurso
export function useUpdateResource(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Resource>) => resourceService.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resource', id] });
    },
  });
}

// Hook para eliminar un recurso
export function useDeleteResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => resourceService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}