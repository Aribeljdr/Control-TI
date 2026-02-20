/**
 * Hook central de estado.
 * Usa IndexedDB para persistencia local — sin dependencia de backend externo.
 * Compatible con Vercel (100% client-side).
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Equipment,
  MaintenanceRecord,
  BitacoraDay,
  ManualFolder,
  ManualFile,
  CredentialCategory,
  CredentialRecord,
} from '../types';
import { db } from '../utils/db';

const newId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

export function usePersistence() {
  const [equipments, setEquipmentsState] = useState<Equipment[]>([]);
  const [maintenances, setMaintenancesState] = useState<MaintenanceRecord[]>([]);
  const [bitacora, setBitacoraState] = useState<Record<string, BitacoraDay>>({});
  const [folders, setFoldersState] = useState<ManualFolder[]>([]);
  const [manuals, setManualsState] = useState<ManualFile[]>([]);
  const [credCategories, setCredCategoriesState] = useState<CredentialCategory[]>([]);
  const [credentials, setCredentialsState] = useState<CredentialRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Carga inicial desde IndexedDB ───────────────────────────────────────

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        eqs, mains, bitacoraArr, fols, mans, cats, creds,
      ] = await Promise.all([
        db.getAll<Equipment>('equipments'),
        db.getAll<MaintenanceRecord>('maintenances'),
        db.getAll<BitacoraDay & { id: string }>('bitacora'),
        db.getAll<ManualFolder>('folders'),
        db.getAll<ManualFile>('manuals'),
        db.getAll<CredentialCategory>('credCategories'),
        db.getAll<CredentialRecord>('credentials'),
      ]);

      setEquipmentsState(eqs);
      setMaintenancesState(mains);

      const bitacoraMap: Record<string, BitacoraDay> = {};
      for (const day of bitacoraArr) bitacoraMap[day.date] = day;
      setBitacoraState(bitacoraMap);

      setFoldersState(fols);
      setManualsState(mans);
      setCredCategoriesState(cats);
      setCredentialsState(creds);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAllData(); }, [loadAllData]);

  // ─── Equipos ──────────────────────────────────────────────────────────────

  const setEquipments = (data: Equipment[]) => setEquipmentsState(data);

  const addEquipment = async (equipment: Equipment) => {
    const item: Equipment = { ...equipment, id: equipment.id || newId() };
    await db.put('equipments', item);
    setEquipmentsState((prev) => [item, ...prev]);
    return { success: true, data: item };
  };

  const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    const current = await db.get<Equipment>('equipments', id);
    const updated = { ...(current ?? {}), ...data, id } as Equipment;
    await db.put('equipments', updated);
    setEquipmentsState((prev) => prev.map((eq) => (eq.id === id ? updated : eq)));
    return { success: true, data: updated };
  };

  const deleteEquipment = async (id: string) => {
    await db.remove('equipments', id);
    setEquipmentsState((prev) => prev.filter((eq) => eq.id !== id));
    return { success: true };
  };

  // ─── Mantenimientos ───────────────────────────────────────────────────────

  const setMaintenances = (data: MaintenanceRecord[]) => setMaintenancesState(data);

  const addMaintenance = async (maintenance: MaintenanceRecord) => {
    const item: MaintenanceRecord = { ...maintenance, id: maintenance.id || newId() };
    await db.put('maintenances', item);
    setMaintenancesState((prev) => [item, ...prev]);
    return { success: true, data: item };
  };

  // ─── Bitácora ─────────────────────────────────────────────────────────────

  const saveBitacoraDay = async (day: BitacoraDay) => {
    // Se usa `date` como id para garantizar unicidad por día
    const item = { ...day, id: day.date };
    await db.put('bitacora', item);
    setBitacoraState((prev) => ({ ...prev, [day.date]: day }));
    return { success: true, data: day };
  };

  // ─── Carpetas de Manuales ─────────────────────────────────────────────────

  const setFolders = async (data: ManualFolder[]) => {
    const withIds = data.map((f) => ({ ...f, id: f.id || newId() }));
    await db.clear('folders');
    await db.bulkPut('folders', withIds);
    setFoldersState(withIds);
  };

  const addFolder = async (folder: Omit<ManualFolder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: ManualFolder = { ...folder, id: newId(), createdAt: now(), updatedAt: now() };
    await db.put('folders', item);
    setFoldersState((prev) => [...prev, item]);
    return { success: true, data: item };
  };

  // ─── Manuales / Wiki ──────────────────────────────────────────────────────

  const setManuals = async (data: ManualFile[]) => {
    const withIds = data.map((m) => ({ ...m, id: m.id || newId() }));
    await db.clear('manuals');
    await db.bulkPut('manuals', withIds);
    setManualsState(withIds);
  };

  const addManual = async (manual: Omit<ManualFile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: ManualFile = { ...manual, id: newId(), createdAt: now(), updatedAt: now() };
    await db.put('manuals', item);
    setManualsState((prev) => [...prev, item]);
    return { success: true, data: item };
  };

  // ─── Categorías de Credenciales ───────────────────────────────────────────

  const saveCredCategories = async (data: CredentialCategory[]) => {
    const withIds = data.map((c) => ({ ...c, id: c.id || newId() }));
    await db.clear('credCategories');
    await db.bulkPut('credCategories', withIds);
    setCredCategoriesState(withIds);
  };

  const addCredCategory = async (category: Omit<CredentialCategory, 'id' | 'createdAt'>) => {
    const item: CredentialCategory = { ...category, id: newId(), createdAt: now() };
    await db.put('credCategories', item);
    setCredCategoriesState((prev) => [...prev, item]);
    return { success: true, data: item };
  };

  // ─── Credenciales ─────────────────────────────────────────────────────────

  const saveCredentials = async (data: CredentialRecord[]) => {
    const withIds = data.map((c) => ({ ...c, id: c.id || newId() }));
    await db.clear('credentials');
    await db.bulkPut('credentials', withIds);
    setCredentialsState(withIds);
  };

  const addCredential = async (
    credential: Omit<CredentialRecord, 'id' | 'createdAt' | 'updatedAt' | 'history'>
  ) => {
    const item: CredentialRecord = {
      ...credential,
      id: newId(),
      history: [],
      createdAt: now(),
      updatedAt: now(),
    };
    await db.put('credentials', item);
    setCredentialsState((prev) => [...prev, item]);
    return { success: true, data: item };
  };

  const updateCredential = async (id: string, data: Partial<CredentialRecord>) => {
    const current = await db.get<CredentialRecord>('credentials', id);
    const updated = { ...(current ?? {}), ...data, id, updatedAt: now() } as CredentialRecord;
    await db.put('credentials', updated);
    setCredentialsState((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return { success: true, data: updated };
  };

  const deleteCredential = async (id: string) => {
    await db.remove('credentials', id);
    setCredentialsState((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  return {
    // Estado
    equipments,
    maintenances,
    bitacora,
    folders,
    manuals,
    credCategories,
    credentials,
    loading,
    error,

    // Equipos
    setEquipments,
    addEquipment,
    updateEquipment,
    deleteEquipment,

    // Mantenimientos
    setMaintenances,
    addMaintenance,

    // Bitácora
    saveBitacoraDay,

    // Carpetas y manuales
    setFolders,
    addFolder,
    setManuals,
    addManual,

    // Credenciales
    saveCredCategories,
    addCredCategory,
    saveCredentials,
    addCredential,
    updateCredential,
    deleteCredential,

    // Control
    loadAllData,
  };
}
