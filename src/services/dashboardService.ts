// src/services/dashboardService.ts
import apiClient from '@/lib/api/apiClient';
import { DashboardConfig, DashboardStats } from '@/types/dashboard';

const DASHBOARD_ENDPOINT = '/dashboard';

export const dashboardService = {
  // Obtener estadísticas del dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get(`${DASHBOARD_ENDPOINT}/stats`);
    return response.data.data || response.data;
  },

  // Obtener configuración del dashboard
  getDashboardConfig: async (): Promise<DashboardConfig> => {
    const response = await apiClient.get(`${DASHBOARD_ENDPOINT}/config`);
    return response.data.data || response.data;
  },

  // Actualizar configuración del dashboard
  updateDashboardConfig: async (config: Partial<DashboardConfig>): Promise<DashboardConfig> => {
    const response = await apiClient.patch(`${DASHBOARD_ENDPOINT}/config`, config);
    return response.data.data || response.data;
  },

  // Añadir widget al dashboard
  addWidget: async (widgetData: Omit<DashboardWidget, 'id'>): Promise<DashboardConfig> => {
    const response = await apiClient.post(`${DASHBOARD_ENDPOINT}/widgets`, widgetData);
    return response.data.data || response.data;
  },

  // Actualizar widget del dashboard
  updateWidget: async (widgetId: string, widgetData: Partial<DashboardWidget>): Promise<DashboardConfig> => {
    const response = await apiClient.patch(`${DASHBOARD_ENDPOINT}/widgets/${widgetId}`, widgetData);
    return response.data.data || response.data;
  },

  // Eliminar widget del dashboard
  removeWidget: async (widgetId: string): Promise<DashboardConfig> => {
    const response = await apiClient.delete(`${DASHBOARD_ENDPOINT}/widgets/${widgetId}`);
    return response.data.data || response.data;
  },

  // Obtener elementos recientes por tipo
  getRecentItems: async (type: string, limit: number = 5): Promise<any[]> => {
    const response = await apiClient.get(`${DASHBOARD_ENDPOINT}/recent/${type}?limit=${limit}`);
    return response.data.data || response.data;
  },

  // Obtener elementos más usados por tipo
  getMostUsedItems: async (type: string, limit: number = 5): Promise<any[]> => {
    const response = await apiClient.get(`${DASHBOARD_ENDPOINT}/most-used/${type}?limit=${limit}`);
    return response.data.data || response.data;
  },
};