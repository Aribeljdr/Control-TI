import { useState, useEffect, useCallback } from 'react';
import {
  Equipment,
  MaintenanceRecord,
  BitacoraDay,
  ManualFolder,
  ManualFile,
  CredentialCategory,
  CredentialRecord
} from '../types';
import { equipmentService } from '../services/equipmentService';
import { maintenanceService } from '../services/maintenanceService';
import { bitacoraService } from '../services/bitacoraService';
import { credentialService } from '../services/credentialService';
import { manualService } from '../services/manualService';
import { authStorage } from '../utils/authStorage';

export function usePersistence() {
  const [equipments, setEquipmentsState] = useState<Equipment[]>([]);
  const [maintenances, setMaintenancesState] = useState<MaintenanceRecord[]>([]);
  const [bitacora, setBitacoraState] = useState<Record<string, BitacoraDay>>({});
  const [folders, setFoldersState] = useState<ManualFolder[]>([]);
  const [manuals, setManualsState] = useState<ManualFile[]>([]);
  const [credCategories, setCredCategoriesState] = useState<CredentialCategory[]>([]);
  const [credentials, setCredentialsState] = useState<CredentialRecord[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar todos los datos
  const loadAllData = useCallback(async () => {
    // Solo cargar si hay token (usuario autenticado)
    const token = authStorage.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [
        equipmentsRes,
        maintenancesRes,
        bitacoraRes,
        foldersRes,
        manualsRes,
        categoriesRes,
        credentialsRes,
      ] = await Promise.all([
        equipmentService.getAll().catch(() => ({ data: [] })),
        maintenanceService.getAll().catch(() => ({ data: [] })),
        bitacoraService.getAll().catch(() => ({ data: [] })),
        manualService.getAllFolders().catch(() => ({ data: [] })),
        manualService.getAll().catch(() => ({ data: [] })),
        credentialService.getAllCategories().catch(() => ({ data: [] })),
        credentialService.getAll().catch(() => ({ data: [] })),
      ]);

      setEquipmentsState(equipmentsRes.data || []);
      setMaintenancesState(maintenancesRes.data || []);

      // Convertir array de bitácora a objeto indexado por fecha
      const bitacoraMap: Record<string, BitacoraDay> = {};
      if (bitacoraRes.data) {
        bitacoraRes.data.forEach((day: BitacoraDay) => {
          bitacoraMap[day.date] = day;
        });
      }
      setBitacoraState(bitacoraMap);

      setFoldersState(foldersRes.data || []);
      setManualsState(manualsRes.data || []);
      setCredCategoriesState(categoriesRes.data || []);
      setCredentialsState(credentialsRes.data || []);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al iniciar SOLO si hay token
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Funciones para actualizar equipos
  const setEquipments = async (data: Equipment[]) => {
    setEquipmentsState(data);
  };

  const addEquipment = async (equipment: Equipment) => {
    try {
      const response = await equipmentService.create(equipment);
      if (response.success && response.data) {
        // Actualizar la lista inmediatamente con el nuevo equipo
        setEquipmentsState((prev) => [response.data, ...prev]);
        return response;
      } else {
        throw new Error(response.message || 'Error al guardar el equipo');
      }
    } catch (err: any) {
      console.error('Error adding equipment:', err);
      // Re-lanzar el error para que el componente pueda manejarlo
      throw new Error(err.message || 'Error al guardar el equipo en la base de datos');
    }
  };

  const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    try {
      const response = await equipmentService.update(id, data);
      if (response.success) {
        setEquipmentsState((prev) =>
          prev.map((eq) => (eq.id === id ? response.data : eq))
        );
      }
      return response;
    } catch (err: any) {
      console.error('Error updating equipment:', err);
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      const response = await equipmentService.delete(id);
      if (response.success) {
        // Eliminar el equipo de la lista inmediatamente
        setEquipmentsState((prev) => prev.filter((eq) => eq.id !== id));
      }
      return response;
    } catch (err: any) {
      console.error('Error deleting equipment:', err);
      throw new Error(err.message || 'Error al eliminar el equipo');
    }
  };

  // Funciones para mantenimientos
  const setMaintenances = (data: MaintenanceRecord[]) => {
    setMaintenancesState(data);
  };

  const addMaintenance = async (maintenance: MaintenanceRecord) => {
    try {
      const response = await maintenanceService.create(maintenance);
      if (response.success) {
        setMaintenancesState((prev) => [response.data, ...prev]);
      }
      return response;
    } catch (err: any) {
      console.error('Error adding maintenance:', err);
      throw err;
    }
  };

  // Funciones para bitácora
  const saveBitacoraDay = async (day: BitacoraDay) => {
    try {
      const response = await bitacoraService.createOrUpdate(day);
      if (response.success) {
        setBitacoraState((prev) => ({ ...prev, [day.date]: response.data }));
      }
      return response;
    } catch (err: any) {
      console.error('Error saving bitacora:', err);
      throw err;
    }
  };

  // Funciones para carpetas
  const setFolders = (data: ManualFolder[]) => {
    setFoldersState(data);
  };

  const addFolder = async (folder: Omit<ManualFolder, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await manualService.createFolder(folder);
      if (response.success) {
        setFoldersState((prev) => [...prev, response.data]);
      }
      return response;
    } catch (err: any) {
      console.error('Error adding folder:', err);
      throw err;
    }
  };

  // Funciones para manuales
  const setManuals = (data: ManualFile[]) => {
    setManualsState(data);
  };

  const addManual = async (manual: Omit<ManualFile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await manualService.create(manual);
      if (response.success) {
        setManualsState((prev) => [...prev, response.data]);
      }
      return response;
    } catch (err: any) {
      console.error('Error adding manual:', err);
      throw err;
    }
  };

  // Funciones para categorías de credenciales
  const saveCredCategories = async (data: CredentialCategory[]) => {
    try {
      // Convertir IDs a strings para comparación
      const getIdString = (item: any) => {
        const id = item.id || item._id;
        return id ? String(id) : null;
      };

      const currentIds = new Set(
        credCategories.map(c => getIdString(c)).filter(Boolean)
      );

      // Encontrar nuevas categorías (las que no tienen id en la lista actual)
      const newCategories = data.filter(cat => {
        const catId = getIdString(cat);
        return catId && !currentIds.has(catId);
      });

      // Crear nuevas categorías en el backend
      for (const category of newCategories) {
        const { id, createdAt, ...categoryData } = category as any;
        await credentialService.createCategory(categoryData);
      }

      // Recargar todas las categorías desde el backend
      const response = await credentialService.getAllCategories();
      setCredCategoriesState(response.data || []);
    } catch (err: any) {
      console.error('Error saving credential categories:', err);
      // Si falla, al menos actualizar el estado local
      setCredCategoriesState(data);
    }
  };

  const addCredCategory = async (category: Omit<CredentialCategory, 'id' | 'createdAt'>) => {
    try {
      const response = await credentialService.createCategory(category);
      if (response.success) {
        setCredCategoriesState((prev) => [...prev, response.data]);
      }
      return response;
    } catch (err: any) {
      console.error('Error adding credential category:', err);
      throw err;
    }
  };

  // Funciones para credenciales
  const saveCredentials = async (data: CredentialRecord[]) => {
    try {
      // Identificar operaciones:
      // 1. Nuevas credenciales (no están en la lista actual)
      // 2. Credenciales actualizadas (están en ambas listas pero con cambios)
      // 3. Credenciales eliminadas (están en la lista actual pero no en la nueva)

      // Convertir todos los IDs a strings para comparación
      const getIdString = (item: any) => {
        const id = item.id || item._id;
        return id ? String(id) : null;
      };

      const currentIds = new Set(
        credentials.map(c => getIdString(c)).filter(Boolean)
      );
      const newIds = new Set(
        data.map(c => getIdString(c)).filter(Boolean)
      );

      // Crear nuevas credenciales
      const newCredentials = data.filter(cred => {
        const credId = getIdString(cred);
        return credId && !currentIds.has(credId);
      });

      for (const credential of newCredentials) {
        const { id, createdAt, updatedAt, history, ...credData } = credential as any;
        await credentialService.create(credData);
      }

      // Actualizar credenciales existentes
      const existingCredentials = data.filter(cred => {
        const credId = getIdString(cred);
        return credId && currentIds.has(credId);
      });

      for (const credential of existingCredentials) {
        const credId = getIdString(credential);
        if (credId) {
          const { id, createdAt, updatedAt, ...credData } = credential as any;
          await credentialService.update(credId, credData);
        }
      }

      // Eliminar credenciales que ya no están
      const deletedIds = [...currentIds].filter(id => !newIds.has(id));
      for (const id of deletedIds) {
        await credentialService.delete(id as string);
      }

      // Recargar todas las credenciales desde el backend
      const response = await credentialService.getAll();
      setCredentialsState(response.data || []);
    } catch (err: any) {
      console.error('Error saving credentials:', err);
      // Si falla, al menos actualizar el estado local
      setCredentialsState(data);
    }
  };

  const addCredential = async (credential: Omit<CredentialRecord, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => {
    try {
      const response = await credentialService.create(credential);
      if (response.success) {
        setCredentialsState((prev) => [...prev, response.data]);
      }
      return response;
    } catch (err: any) {
      console.error('Error adding credential:', err);
      throw err;
    }
  };

  const updateCredential = async (id: string, data: Partial<CredentialRecord>) => {
    try {
      const response = await credentialService.update(id, data);
      if (response.success) {
        setCredentialsState((prev) =>
          prev.map((cred) => {
            const credId = String(cred.id || (cred as any)._id);
            return credId === String(id) ? response.data : cred;
          })
        );
      }
      return response;
    } catch (err: any) {
      console.error('Error updating credential:', err);
      throw err;
    }
  };

  const deleteCredential = async (id: string) => {
    try {
      const response = await credentialService.delete(id);
      if (response.success) {
        setCredentialsState((prev) =>
          prev.filter((cred) => {
            const credId = String(cred.id || (cred as any)._id);
            return credId !== String(id);
          })
        );
      }
      return response;
    } catch (err: any) {
      console.error('Error deleting credential:', err);
      throw err;
    }
  };

  return {
    equipments,
    setEquipments,
    addEquipment,
    updateEquipment,
    deleteEquipment,

    maintenances,
    setMaintenances,
    addMaintenance,

    bitacora,
    saveBitacoraDay,

    folders,
    setFolders,
    addFolder,

    manuals,
    setManuals,
    addManual,

    credCategories,
    saveCredCategories,
    addCredCategory,

    credentials,
    saveCredentials,
    addCredential,
    updateCredential,
    deleteCredential,

    loading,
    error,
    loadAllData, // Exportar para poder recargar manualmente
  };
}
