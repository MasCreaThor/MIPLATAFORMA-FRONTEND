// src/hooks/useCategoryOperations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, Category, CreateCategoryDto } from '@/services/categoryService';

// Hook para obtener todas las categorías (sistema + propias)
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });
}

// Hook para obtener solo las categorías del sistema
export function useSystemCategories() {
  return useQuery({
    queryKey: ['systemCategories'],
    queryFn: () => categoryService.getSystemCategories(),
  });
}

// Hook para obtener categorías raíz (sistema + propias)
export function useRootCategories() {
  return useQuery({
    queryKey: ['rootCategories'],
    queryFn: () => categoryService.getRootCategories(),
  });
}

// Hook para obtener una categoría específica por ID
export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
  });
}

// Hook para obtener categorías hijas de una categoría
export function useCategoryChildren(id: string) {
  return useQuery({
    queryKey: ['categoryChildren', id],
    queryFn: () => categoryService.getCategoryChildren(id),
    enabled: !!id,
  });
}

// Hook para crear una categoría
export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['rootCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryChildren'] });
    },
  });
}

// Hook para actualizar una categoría
export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<CreateCategoryDto>) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['rootCategories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      queryClient.invalidateQueries({ queryKey: ['categoryChildren'] });
    },
  });
}

// Hook para eliminar una categoría
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['rootCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryChildren'] });
    },
  });
}