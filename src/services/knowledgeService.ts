// src/services/knowledgeService.ts
import apiClient from '@/lib/api/apiClient';
import { KnowledgeItem, KnowledgeItemFilters } from '@/types/knowledge';

const KNOWLEDGE_ENDPOINT = '/knowledge';

export const knowledgeService = {
  // Obtener elementos de conocimiento con filtros opcionales
  getKnowledgeItems: async (filters: KnowledgeItemFilters = {}): Promise<KnowledgeItem[]> => {
    // Crear una copia limpia del objeto de filtros
    const cleanFilters: Record<string, any> = { ...filters };
    
    // Eliminar arrays vacíos y cadenas vacías para evitar problemas de serialización
    Object.keys(cleanFilters).forEach(key => {
      // Usar una aserción de tipo segura
      const value = cleanFilters[key];
      if (Array.isArray(value) && value.length === 0) {
        delete cleanFilters[key];
      }
      if (value === '') {
        delete cleanFilters[key];
      }
    });
    
    // Convertir arrays a formato adecuado si es necesario
    if (cleanFilters.types && Array.isArray(cleanFilters.types) && cleanFilters.types.length) {
      // Convertir a string o formato esperado por el backend
      cleanFilters.types = cleanFilters.types.join(',');
    }
    
    if (cleanFilters.tags && Array.isArray(cleanFilters.tags) && cleanFilters.tags.length) {
      cleanFilters.tags = cleanFilters.tags.join(',');
    }
    
    const response = await apiClient.get(KNOWLEDGE_ENDPOINT, { params: cleanFilters });
    return response.data.data || response.data;
  },

  // El resto del servicio permanece igual
  getKnowledgeItemById: async (id: string): Promise<KnowledgeItem> => {
    const response = await apiClient.get(`${KNOWLEDGE_ENDPOINT}/${id}`);
    return response.data.data || response.data;
  },

  createKnowledgeItem: async (knowledgeItem: Partial<KnowledgeItem>): Promise<KnowledgeItem> => {
    // Limpiar datos antes de enviar
    const cleanData = { ...knowledgeItem };

    if (cleanData.categoryId === '') {
      cleanData.categoryId = undefined;
    }
    
    const response = await apiClient.post(KNOWLEDGE_ENDPOINT, cleanData);
    return response.data.data || response.data;
  },
  
  updateKnowledgeItem: async (id: string, knowledgeItem: Partial<KnowledgeItem>): Promise<KnowledgeItem> => {
    // Limpiar datos antes de enviar
    const cleanData = { ...knowledgeItem };

    if (cleanData.categoryId === '') {
      cleanData.categoryId = undefined;
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