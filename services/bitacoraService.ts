import { apiClient } from './api';
import { BitacoraDay } from '../types';

export const bitacoraService = {
  async getAll() {
    return apiClient.get<{ success: boolean; count: number; data: BitacoraDay[] }>('/bitacora');
  },

  async getByDate(date: string) {
    return apiClient.get<{ success: boolean; data: BitacoraDay }>(`/bitacora/${date}`);
  },

  async createOrUpdate(data: BitacoraDay) {
    return apiClient.post<{ success: boolean; message: string; data: BitacoraDay }>('/bitacora', data);
  },

  async delete(date: string) {
    return apiClient.delete<{ success: boolean; message: string }>(`/bitacora/${date}`);
  },
};
