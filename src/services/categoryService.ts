// src/services/categoryService.ts
import apiClient from '@/lib/api/apiClient';

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  color?: string;
  icon?: string;
  isPublic?: boolean;
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
  isPublic?: boolean;
}

const CATEGORY_ENDPOINT = '/categories';

// Función para limpiar los datos antes de enviarlos al servidor
const sanitizeCategoryData = (data: any): any => {
  const cleanData: any = { ...data };
  
  // Asegurarse de que el campo name esté presente
  if (!cleanData.name || typeof cleanData.name !== 'string' || cleanData.name.trim() === '') {
    throw new Error('El nombre de la categoría es obligatorio');
  }
  
  // Manejar parentId vacío o inválido
  if (cleanData.parentId === '' || cleanData.parentId === undefined) {
    delete cleanData.parentId; // Eliminar la propiedad si está vacía
  } else if (cleanData.parentId && typeof cleanData.parentId === 'string') {
    // Verificar si es un ID de MongoDB válido (24 caracteres hexadecimales)
    if (!/^[0-9a-fA-F]{24}$/.test(cleanData.parentId)) {
      console.warn('ID de categoría padre inválido, se eliminará del payload');
      delete cleanData.parentId;
    }
  }
  
  // Asegurarse de que isPublic sea un booleano
  if (cleanData.isPublic !== undefined) {
    cleanData.isPublic = Boolean(cleanData.isPublic);
  }
  
  return cleanData;
};

export const categoryService = {
  // Obtener todas las categorías (sistema + propias)
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get(CATEGORY_ENDPOINT);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Obtener solo las categorías del sistema
  getSystemCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get(`${CATEGORY_ENDPOINT}/system`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching system categories:', error);
      throw error;
    }
  },

  // Obtener categorías raíz (sistema + propias)
  getRootCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get(`${CATEGORY_ENDPOINT}/root`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching root categories:', error);
      throw error;
    }
  },

  // Obtener una categoría por ID
  getCategoryById: async (id: string): Promise<Category> => {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID de categoría inválido');
      }
      
      const response = await apiClient.get(`${CATEGORY_ENDPOINT}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener categorías hijas de una categoría
  getCategoryChildren: async (id: string): Promise<Category[]> => {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID de categoría inválido');
      }
      
      const response = await apiClient.get(`${CATEGORY_ENDPOINT}/${id}/children`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching children for category ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva categoría (requiere parentId)
  createCategory: async (categoryData: CreateCategoryDto): Promise<Category> => {
    try {
      // Limpiar datos antes de enviar
      const cleanData = sanitizeCategoryData(categoryData);
      
      // Verificar que tiene parentId (ahora obligatorio)
      if (!cleanData.parentId) {
        throw new Error('Se requiere una categoría padre para crear una subcategoría');
      }
      
      console.log('Sending category data to server:', cleanData);
      
      const response = await apiClient.post(CATEGORY_ENDPOINT, cleanData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Actualizar una categoría existente
  updateCategory: async (id: string, categoryData: Partial<CreateCategoryDto>): Promise<Category> => {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID de categoría inválido');
      }
      
      // Limpiar datos antes de enviar
      const cleanData = sanitizeCategoryData({
        name: 'placeholder', // Valor temporal para pasar la validación
        ...categoryData
      });
      
      // Si solo estamos actualizando campos parciales, name no es obligatorio
      if (categoryData.name === undefined && cleanData.name === 'placeholder') {
        delete cleanData.name;
      }
      
      console.log(`Updating category ${id} with data:`, cleanData);
      
      const response = await apiClient.patch(`${CATEGORY_ENDPOINT}/${id}`, cleanData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una categoría
  deleteCategory: async (id: string): Promise<void> => {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID de categoría inválido');
      }
      
      await apiClient.delete(`${CATEGORY_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};