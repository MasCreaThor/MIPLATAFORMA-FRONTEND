// src/services/knowledgeService.ts
import apiClient from '@/lib/api/apiClient';
import { KnowledgeItem, KnowledgeItemFilters } from '@/types/knowledge';

const KNOWLEDGE_ENDPOINT = '/knowledge';

export const knowledgeService = {
  // Obtener elementos de conocimiento con filtros opcionales
  getKnowledgeItems: async (filters: KnowledgeItemFilters = {}): Promise<KnowledgeItem[]> => {
    const response = await apiClient.get(KNOWLEDGE_ENDPOINT, { params: filters });
    return response.data.data || response.data;
  },

  // Obtener un elemento de conocimiento por ID
  getKnowledgeItemById: async (id: string): Promise<KnowledgeItem> => {
    const response = await apiClient.get(`${KNOWLEDGE_ENDPOINT}/${id}`);
    return response.data.data || response.data;
  },

  // Crear un nuevo elemento de conocimiento
  createKnowledgeItem: async (knowledgeItem: Partial<KnowledgeItem>): Promise<KnowledgeItem> => {
    const response = await apiClient.post(KNOWLEDGE_ENDPOINT, knowledgeItem);
    return response.data.data || response.data;
  },

  // Actualizar un elemento de conocimiento existente
  updateKnowledgeItem: async (id: string, knowledgeItem: Partial<KnowledgeItem>): Promise<KnowledgeItem> => {
    const response = await apiClient.patch(`${KNOWLEDGE_ENDPOINT}/${id}`, knowledgeItem);
    return response.data.data || response.data;
  },

  // Eliminar un elemento de conocimiento
  deleteKnowledgeItem: async (id: string): Promise<void> => {
    await apiClient.delete(`${KNOWLEDGE_ENDPOINT}/${id}`);
  },

  // Incrementar contador de uso
  incrementUsage: async (id: string): Promise<KnowledgeItem> => {
    const response = await apiClient.post(`${KNOWLEDGE_ENDPOINT}/${id}/increment-usage`);
    return response.data.data || response.data;
  },

  // Obtener elementos de conocimiento por categoría
  getKnowledgeItemsByCategory: async (categoryId: string): Promise<KnowledgeItem[]> => {
    const response = await apiClient.get(`${KNOWLEDGE_ENDPOINT}/by-category/${categoryId}`);
    return response.data.data || response.data;
  },

  // Obtener elementos de conocimiento por etiquetas
  getKnowledgeItemsByTags: async (tags: string[]): Promise<KnowledgeItem[]> => {
    const tagsParam = tags.join(',');
    const response = await apiClient.get(`${KNOWLEDGE_ENDPOINT}/by-tags?tags=${tagsParam}`);
    return response.data.data || response.data;
  },

  // Obtener elementos relacionados
  getRelatedItems: async (id: string): Promise<KnowledgeItem[]> => {
    const response = await apiClient.get(`${KNOWLEDGE_ENDPOINT}/${id}/related`);
    return response.data.data || response.data;
  },

  // Agregar elemento relacionado
  addRelatedItem: async (id: string, relatedId: string): Promise<KnowledgeItem> => {
    const response = await apiClient.post(`${KNOWLEDGE_ENDPOINT}/${id}/related/${relatedId}`);
    return response.data.data || response.data;
  },

  // Eliminar elemento relacionado
  removeRelatedItem: async (id: string, relatedId: string): Promise<KnowledgeItem> => {
    const response = await apiClient.delete(`${KNOWLEDGE_ENDPOINT}/${id}/related/${relatedId}`);
    return response.data.data || response.data;
  },
};