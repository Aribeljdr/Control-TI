import { apiClient } from './api';
import { ManualFile, ManualFolder } from '../types';

export const manualService = {
  // Folders
  async getAllFolders() {
    return apiClient.get<{ success: boolean; count: number; data: ManualFolder[] }>('/manuals/folders');
  },

  async createFolder(data: Omit<ManualFolder, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<{ success: boolean; message: string; data: ManualFolder }>('/manuals/folders', data);
  },

  async updateFolder(id: string, data: Partial<ManualFolder>) {
    return apiClient.put<{ success: boolean; message: string; data: ManualFolder }>(`/manuals/folders/${id}`, data);
  },

  async deleteFolder(id: string) {
    return apiClient.delete<{ success: boolean; message: string }>(`/manuals/folders/${id}`);
  },

  // Manuals
  async getAll(filters?: { folderId?: string }) {
    const params = new URLSearchParams();
    if (filters?.folderId) params.append('folderId', filters.folderId);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<{ success: boolean; count: number; data: ManualFile[] }>(`/manuals${query}`);
  },

  async getById(id: string) {
    return apiClient.get<{ success: boolean; data: ManualFile }>(`/manuals/${id}`);
  },

  async create(data: Omit<ManualFile, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<{ success: boolean; message: string; data: ManualFile }>('/manuals', data);
  },

  async update(id: string, data: Partial<ManualFile>) {
    return apiClient.put<{ success: boolean; message: string; data: ManualFile }>(`/manuals/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete<{ success: boolean; message: string }>(`/manuals/${id}`);
  },
};
