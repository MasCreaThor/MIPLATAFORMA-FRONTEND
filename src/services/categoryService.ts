// src/services/categoryService.ts
import apiClient from '@/lib/api/apiClient';

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

const CATEGORY_ENDPOINT = '/categories';

export const categoryService = {
  // Obtener todas las categorías
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get(CATEGORY_ENDPOINT);
    return response.data.data || response.data;
  },

  // Obtener categorías raíz (sin padre)
  getRootCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get(`${CATEGORY_ENDPOINT}/root`);
    return response.data.data || response.data;
  },

  // Obtener una categoría por ID
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`${CATEGORY_ENDPOINT}/${id}`);
    return response.data.data || response.data;
  },

  // Obtener categorías hijas de una categoría
  getCategoryChildren: async (id: string): Promise<Category[]> => {
    const response = await apiClient.get(`${CATEGORY_ENDPOINT}/${id}/children`);
    return response.data.data || response.data;
  },

  // Crear una nueva categoría
  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post(CATEGORY_ENDPOINT, category);
    return response.data.data || response.data;
  },

  // Actualizar una categoría existente
  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await apiClient.patch(`${CATEGORY_ENDPOINT}/${id}`, category);
    return response.data.data || response.data;
  },

  // Eliminar una categoría
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`${CATEGORY_ENDPOINT}/${id}`);
  },
};