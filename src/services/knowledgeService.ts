// src/services/knowledgeService.ts
import apiClient from '@/lib/api/apiClient';
import { KnowledgeItem, KnowledgeItemFilters } from '@/types/knowledge';

const KNOWLEDGE_ENDPOINT = '/knowledge';

export const knowledgeService = {
  // Obtener elementos de conocimiento con filtros opcionales
  getKnowledgeItems: async (filters: KnowledgeItemFilters = {}): Promise<KnowledgeItem[]> => {
    try {
      // Crear una copia limpia del objeto de filtros
      const cleanFilters: Record<string, any> = {};
      
      // Solo copiar propiedades que tienen valores válidos
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof KnowledgeItemFilters];
        
        // Comprobar si hay valores que merecen ser incluidos
        if (Array.isArray(value) && value.length > 0) {
          cleanFilters[key] = value;
        } else if (value !== '' && value !== undefined && value !== null) {
          cleanFilters[key] = value;
        }
      });
      
      // Convertir arrays a formato correcto para la API
      if (cleanFilters.types && Array.isArray(cleanFilters.types) && cleanFilters.types.length > 0) {
        cleanFilters.types = cleanFilters.types.join(',');
      }
      
      if (cleanFilters.tags && Array.isArray(cleanFilters.tags) && cleanFilters.tags.length > 0) {
        cleanFilters.tags = cleanFilters.tags.join(',');
      }
      
      console.log("Calling API with clean filters:", cleanFilters);
      
      // Hacer la petición a la API sin filtros vacíos que puedan causar problemas
      const response = await apiClient.get(KNOWLEDGE_ENDPOINT, { 
        params: Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined 
      });
      
      console.log("Raw API response:", response);
      
      // Manejar diferentes formatos de respuesta
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Intenta encontrar un array en alguna propiedad
        const possibleArrays = Object.values(response.data).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          return possibleArrays[0] as KnowledgeItem[];
        }
      }
      
      console.warn("Could not extract knowledge items from response:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching knowledge items:", error);
      throw error;
    }
  },

  // El resto del servicio permanece igual
  getKnowledgeItemById: async (id: string): Promise<KnowledgeItem> => {
    const response = await apiClient.get(`${KNOWLEDGE_ENDPOINT}/${id}`);
    return response.data.data || response.data;
  },

  createKnowledgeItem: async (knowledgeItem: Partial<KnowledgeItem>): Promise<KnowledgeItem> => {
    // Limpiar datos antes de enviar
    const cleanData = { ...knowledgeItem };

    // Mejorar la limpieza del categoryId
    if (cleanData.categoryId === '' || !cleanData.categoryId) {
      delete cleanData.categoryId; // Eliminar completamente la propiedad
    } else if (typeof cleanData.categoryId === 'string' && 
              !/^[0-9a-fA-F]{24}$/.test(cleanData.categoryId)) {
      // Si no es un ID de MongoDB válido (24 caracteres hex), eliminarlo
      delete cleanData.categoryId;
    }
    
    const response = await apiClient.post(KNOWLEDGE_ENDPOINT, cleanData);
    return response.data.data || response.data;
  },
  
  updateKnowledgeItem: async (id: string, knowledgeItem: Partial<KnowledgeItem>): Promise<KnowledgeItem> => {
    // Limpiar datos antes de enviar
    const cleanData = { ...knowledgeItem };

    // Aplicar la misma lógica de limpieza que en createKnowledgeItem
    if (cleanData.categoryId === '' || !cleanData.categoryId) {
      delete cleanData.categoryId; // Eliminar completamente la propiedad
    } else if (typeof cleanData.categoryId === 'string' && 
              !/^[0-9a-fA-F]{24}$/.test(cleanData.categoryId)) {
      // Si no es un ID de MongoDB válido (24 caracteres hex), eliminarlo
      delete cleanData.categoryId;
    }
    
    const response = await apiClient.patch(`${KNOWLEDGE_ENDPOINT}/${id}`, cleanData);
    return response.data.data || response.data;
  },

  deleteKnowledgeItem: async (id: string): Promise<void> => {
    await apiClient.delete(`${KNOWLEDGE_ENDPOINT}/${id}`);
  },

  incrementUsage: async (id: string): Promise<KnowledgeItem> => {
    const response = await apiClient.post(`${KNOWLEDGE_ENDPOINT}/${id}/increment-usage`);
    return response.data.data || response.data;
  },

  getKnowledgeItemsByCategory: async (categoryId: string): Promise<KnowledgeItem[]> => {
    const response = await apiClient.get(`${KNOWLEDGE_ENDPOINT}/by-category/${categoryId}`);
    return response.data.data || response.data;
  },

  getKnowledgeItemsByTags: async (tags: string[]): Promise<KnowledgeItem[]> => {
    const tagsParam = tags.join(',');
    const response = await apiClient.get(`${KNOWLEDGE_ENDPOINT}/by-tags?tags=${tagsParam}`);
    return response.data.data || response.data;
  },

  getRelatedItems: async (id: string): Promise<KnowledgeItem[]> => {
    const response = await apiClient.get(`${KNOWLEDGE_ENDPOINT}/${id}/related`);
    return response.data.data || response.data;
  },

  addRelatedItem: async (id: string, relatedId: string): Promise<KnowledgeItem> => {
    const response = await apiClient.post(`${KNOWLEDGE_ENDPOINT}/${id}/related/${relatedId}`);
    return response.data.data || response.data;
  },

  removeRelatedItem: async (id: string, relatedId: string): Promise<KnowledgeItem> => {
    const response = await apiClient.delete(`${KNOWLEDGE_ENDPOINT}/${id}/related/${relatedId}`);
    return response.data.data || response.data;
  },
};