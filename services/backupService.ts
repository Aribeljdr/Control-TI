import { apiClient } from './api';

export interface BackupStructure {
  appName: string;
  schemaVersion: string;
  exportedAt: string;
  exportedBy: string;
  counts: {
    equipment: number;
    maintenances: number;
    bitacoraDays: number;
    manualFolders: number;
    manualFiles: number;
    credentialCategories: number;
    credentials: number;
  };
  data: {
    equipments: any[];
    maintenances: any[];
    bitacora: any[];
    folders: any[];
    manuals: any[];
    credCategories: any[];
    credentials: any[];
  };
}

export const backupService = {
  async exportData() {
    return apiClient.get<BackupStructure>('/backup/export');
  },

  async importData(data: BackupStructure) {
    return apiClient.post<{ success: boolean; message: string }>('/backup/import', data);
  }
};
