// src/hooks/useKnowledge.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeService } from '@/services/knowledgeService';
import { KnowledgeItem, KnowledgeItemFilters } from '@/types/knowledge';

// Hook para obtener elementos de conocimiento
export function useKnowledgeItems(
  filters: KnowledgeItemFilters = {}, 
  options: { enabled?: boolean } = { enabled: true }
) {
  return useQuery({
    queryKey: ['knowledgeItems', filters],
    queryFn: () => knowledgeService.getKnowledgeItems(filters),
    enabled: options.enabled,
  });
}

// Hook para obtener un elemento de conocimiento específico
export function useKnowledgeItem(id: string) {
  return useQuery({
    queryKey: ['knowledgeItem', id],
    queryFn: () => knowledgeService.getKnowledgeItemById(id),
    enabled: !!id,
  });
}

// Hook para crear un elemento de conocimiento
export function useCreateKnowledgeItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<KnowledgeItem>) => knowledgeService.createKnowledgeItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeItems'] });
    },
  });
}

// Hook para actualizar un elemento de conocimiento
export function useUpdateKnowledgeItem(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<KnowledgeItem>) => knowledgeService.updateKnowledgeItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeItems'] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeItem', id] });
    },
  });
}

// Hook para eliminar un elemento de conocimiento
export function useDeleteKnowledgeItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => knowledgeService.deleteKnowledgeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeItems'] });
    },
  });
}

// Hook para elementos relacionados
export function useRelatedKnowledgeItems(id: string) {
  return useQuery({
    queryKey: ['relatedKnowledgeItems', id],
    queryFn: () => knowledgeService.getRelatedItems(id),
    enabled: !!id,
  });
}

// Hook para agregar elemento relacionado
export function useAddRelatedItem(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (relatedId: string) => knowledgeService.addRelatedItem(id, relatedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeItem', id] });
      queryClient.invalidateQueries({ queryKey: ['relatedKnowledgeItems', id] });
    },
  });
}

// Hook para eliminar elemento relacionado
export function useRemoveRelatedItem(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (relatedId: string) => knowledgeService.removeRelatedItem(id, relatedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeItem', id] });
      queryClient.invalidateQueries({ queryKey: ['relatedKnowledgeItems', id] });
    },
  });
}