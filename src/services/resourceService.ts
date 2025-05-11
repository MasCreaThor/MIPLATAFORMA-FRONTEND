// src/services/resourceService.ts
import apiClient from '@/lib/api/apiClient';
import { Resource, ResourceFilters } from '@/types/resource';

const RESOURCE_ENDPOINT = '/resources';

export const resourceService = {
  // Obtener recursos con filtros opcionales
  getResources: async (filters: ResourceFilters = {}): Promise<Resource[]> => {
    const response = await apiClient.get(RESOURCE_ENDPOINT, { params: filters });
    return response.data.data || response.data;
  },

  // Obtener un recurso por ID
  getResourceById: async (id: string): Promise<Resource> => {
    const response = await apiClient.get(`${RESOURCE_ENDPOINT}/${id}`);
    return response.data.data || response.data;
  },

  // Crear un nuevo recurso
  createResource: async (resource: Partial<Resource>): Promise<Resource> => {
    const response = await apiClient.post(RESOURCE_ENDPOINT, resource);
    return response.data.data || response.data;
  },

  // Subir un archivo y crear un recurso
  uploadResource: async (file: File, metadata: Partial<Resource>): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Añadir los metadatos al formData
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.post(`${RESOURCE_ENDPOINT}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data || response.data;
  },

  // Actualizar un recurso existente
  updateResource: async (id: string, resource: Partial<Resource>): Promise<Resource> => {
    const response = await apiClient.patch(`${RESOURCE_ENDPOINT}/${id}`, resource);
    return response.data.data || response.data;
  },

  // Eliminar un recurso
  deleteResource: async (id: string): Promise<void> => {
    await apiClient.delete(`${RESOURCE_ENDPOINT}/${id}`);
  },

  // Incrementar contador de uso
  incrementUsage: async (id: string): Promise<Resource> => {
    const response = await apiClient.post(`${RESOURCE_ENDPOINT}/${id}/increment-usage`);
    return response.data.data || response.data;
  },

  // Obtener recursos por categoría
  getResourcesByCategory: async (categoryId: string): Promise<Resource[]> => {
    const response = await apiClient.get(`${RESOURCE_ENDPOINT}/by-category/${categoryId}`);
    return response.data.data || response.data;
  },

  // Obtener recursos por etiquetas
  getResourcesByTags: async (tags: string[]): Promise<Resource[]> => {
    const tagsParam = tags.join(',');
    const response = await apiClient.get(`${RESOURCE_ENDPOINT}/by-tags?tags=${tagsParam}`);
    return response.data.data || response.data;
  },
};

// Exportamos también como resourcesService para compatibilidad
export const resourcesService = resourceService;