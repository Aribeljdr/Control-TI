import { apiClient } from './api';
import { MaintenanceRecord } from '../types';

export const maintenanceService = {
  async getAll(filters?: { equipmentId?: string; type?: string }) {
    const params = new URLSearchParams();
    if (filters?.equipmentId) params.append('equipmentId', filters.equipmentId);
    if (filters?.type) params.append('type', filters.type);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<{ success: boolean; count: number; data: MaintenanceRecord[] }>(`/maintenances${query}`);
  },

  async getById(id: string) {
    return apiClient.get<{ success: boolean; data: MaintenanceRecord }>(`/maintenances/${id}`);
  },

  async create(data: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<{ success: boolean; message: string; data: MaintenanceRecord }>('/maintenances', data);
  },

  async update(id: string, data: Partial<MaintenanceRecord>) {
    return apiClient.put<{ success: boolean; message: string; data: MaintenanceRecord }>(`/maintenances/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete<{ success: boolean; message: string }>(`/maintenances/${id}`);
  },
};
