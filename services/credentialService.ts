import { apiClient } from './api';
import { CredentialRecord, CredentialCategory } from '../types';

export const credentialService = {
  // Categories
  async getAllCategories() {
    return apiClient.get<{ success: boolean; count: number; data: CredentialCategory[] }>('/credentials/categories');
  },

  async createCategory(data: Omit<CredentialCategory, 'id' | 'createdAt'>) {
    return apiClient.post<{ success: boolean; message: string; data: CredentialCategory }>('/credentials/categories', data);
  },

  // Credentials
  async getAll(filters?: { categoryId?: string; status?: string; company?: string }) {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.company) params.append('company', filters.company);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<{ success: boolean; count: number; data: CredentialRecord[] }>(`/credentials${query}`);
  },

  async getById(id: string) {
    return apiClient.get<{ success: boolean; data: CredentialRecord }>(`/credentials/${id}`);
  },

  async create(data: Omit<CredentialRecord, 'id' | 'createdAt' | 'updatedAt' | 'history'>) {
    return apiClient.post<{ success: boolean; message: string; data: CredentialRecord }>('/credentials', data);
  },

  async update(id: string, data: Partial<CredentialRecord>) {
    return apiClient.put<{ success: boolean; message: string; data: CredentialRecord }>(`/credentials/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete<{ success: boolean; message: string }>(`/credentials/${id}`);
  },
};
