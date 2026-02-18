import { apiClient } from './api';
import { Equipment } from '../types';

export const equipmentService = {
  async getAll(filters?: { area?: string; status?: string; type?: string }) {
    const params = new URLSearchParams();
    if (filters?.area) params.append('area', filters.area);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<{ success: boolean; count: number; data: Equipment[] }>(`/equipments${query}`);
  },

  async getById(id: string) {
    return apiClient.get<{ success: boolean; data: Equipment }>(`/equipments/${id}`);
  },

  async create(data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<{ success: boolean; message: string; data: Equipment }>('/equipments', data);
  },

  async update(id: string, data: Partial<Equipment>) {
    return apiClient.put<{ success: boolean; message: string; data: Equipment }>(`/equipments/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete<{ success: boolean; message: string }>(`/equipments/${id}`);
  },
};
