/**
 * Servicio de respaldo usando IndexedDB local.
 * El backend MongoDB/Express está comentado abajo para referencia futura.
 */
import { db } from '../utils/db';

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
    equipments: unknown[];
    maintenances: unknown[];
    bitacora: unknown[];
    folders: unknown[];
    manuals: unknown[];
    credCategories: unknown[];
    credentials: unknown[];
  };
}

export const backupService = {
  async exportData(): Promise<BackupStructure> {
    const data = await db.exportAll();

    return {
      appName: 'Mantenimiento Preventivo IT',
      schemaVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      exportedBy: 'Soporte TI',
      counts: {
        equipment: data.equipments.length,
        maintenances: data.maintenances.length,
        bitacoraDays: data.bitacora.length,
        manualFolders: data.folders.length,
        manualFiles: data.manuals.length,
        credentialCategories: data.credCategories.length,
        credentials: data.credentials.length,
      },
      data: {
        equipments: data.equipments,
        maintenances: data.maintenances,
        bitacora: data.bitacora,
        folders: data.folders,
        manuals: data.manuals,
        credCategories: data.credCategories,
        credentials: data.credentials,
      },
    };
  },

  async importData(backup: BackupStructure): Promise<{ success: boolean; message: string }> {
    // Soporte para backups con bitácora en formato objeto {fecha: day} (versión MongoDB)
    const bitacoraArr = Array.isArray(backup.data.bitacora)
      ? backup.data.bitacora
      : Object.values(backup.data.bitacora ?? {});

    await db.importAll({
      equipments: backup.data.equipments as never[],
      maintenances: backup.data.maintenances as never[],
      bitacora: bitacoraArr as never[],
      folders: backup.data.folders as never[],
      manuals: backup.data.manuals as never[],
      credCategories: backup.data.credCategories as never[],
      credentials: backup.data.credentials as never[],
    });

    return { success: true, message: 'Base de datos restaurada exitosamente.' };
  },
};

// ─── Backend MongoDB (comentado — para reactivar en modo producción con servidor) ───
/*
import { apiClient } from './api';

export const backupServiceAPI = {
  async exportData() {
    return apiClient.get<BackupStructure>('/backup/export');
  },
  async importData(data: BackupStructure) {
    return apiClient.post<{ success: boolean; message: string }>('/backup/import', data);
  },
};
*/
