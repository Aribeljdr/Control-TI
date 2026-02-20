/**
 * Capa de persistencia local usando IndexedDB.
 * Reemplaza todas las llamadas al backend Express/MongoDB.
 * Cada store usa `id` como keyPath.
 * Para BitacoraDay se usa `date` como id al guardar.
 */

const DB_NAME = 'ControlTI_DB';
const DB_VERSION = 1;

export type StoreName =
  | 'equipments'
  | 'maintenances'
  | 'bitacora'
  | 'folders'
  | 'manuals'
  | 'credCategories'
  | 'credentials';

const STORE_NAMES: StoreName[] = [
  'equipments',
  'maintenances',
  'bitacora',
  'folders',
  'manuals',
  'credCategories',
  'credentials',
];

let _db: IDBDatabase | null = null;

const getDB = (): Promise<IDBDatabase> => {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORE_NAMES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' });
        }
      }
    };

    req.onsuccess = () => {
      _db = req.result;
      _db.onclose = () => { _db = null; };
      resolve(_db);
    };

    req.onerror = () => reject(req.error);
  });
};

// Normaliza items que vienen de backups MongoDB (_id) para que tengan `id`
const withId = (item: Record<string, unknown>, fallbackKey?: string): Record<string, unknown> => {
  if (item.id) return item;
  const derived = fallbackKey ? item[fallbackKey] : (item._id ?? crypto.randomUUID());
  return { ...item, id: String(derived) };
};

export const db = {
  async getAll<T>(store: StoreName): Promise<T[]> {
    const d = await getDB();
    return new Promise((resolve, reject) => {
      const req = d.transaction(store, 'readonly').objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  },

  async get<T>(store: StoreName, id: string): Promise<T | undefined> {
    const d = await getDB();
    return new Promise((resolve, reject) => {
      const req = d.transaction(store, 'readonly').objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  },

  async put<T extends { id: string }>(store: StoreName, item: T): Promise<T> {
    const d = await getDB();
    return new Promise((resolve, reject) => {
      const req = d.transaction(store, 'readwrite').objectStore(store).put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  },

  async remove(store: StoreName, id: string): Promise<void> {
    const d = await getDB();
    return new Promise((resolve, reject) => {
      const req = d.transaction(store, 'readwrite').objectStore(store).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async clear(store: StoreName): Promise<void> {
    const d = await getDB();
    return new Promise((resolve, reject) => {
      const req = d.transaction(store, 'readwrite').objectStore(store).clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async bulkPut(store: StoreName, items: Array<{ id: string }>): Promise<void> {
    if (!items.length) return;
    const d = await getDB();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      for (const item of items) os.put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  /** Exporta toda la base de datos para el módulo de Respaldo */
  async exportAll(): Promise<Record<StoreName, unknown[]>> {
    const results = await Promise.all(STORE_NAMES.map((s) => db.getAll(s)));
    return Object.fromEntries(
      STORE_NAMES.map((s, i) => [s, results[i]])
    ) as Record<StoreName, unknown[]>;
  },

  /**
   * Importa un backup completo.
   * Soporta backups del backend MongoDB (_id) y del IndexedDB (id).
   */
  async importAll(data: Partial<Record<StoreName, unknown[]>>): Promise<void> {
    // Limpia todos los stores primero
    await Promise.all(STORE_NAMES.map((s) => db.clear(s)));

    const normalize = (items: unknown[], fallbackKey?: string) =>
      (items as Array<Record<string, unknown>>).map((item) =>
        withId(item, fallbackKey)
      ) as Array<{ id: string }>;

    await Promise.all([
      data.equipments?.length
        ? db.bulkPut('equipments', normalize(data.equipments))
        : Promise.resolve(),
      data.maintenances?.length
        ? db.bulkPut('maintenances', normalize(data.maintenances))
        : Promise.resolve(),
      data.bitacora?.length
        ? db.bulkPut('bitacora', normalize(data.bitacora, 'date'))
        : Promise.resolve(),
      data.folders?.length
        ? db.bulkPut('folders', normalize(data.folders))
        : Promise.resolve(),
      data.manuals?.length
        ? db.bulkPut('manuals', normalize(data.manuals))
        : Promise.resolve(),
      data.credCategories?.length
        ? db.bulkPut('credCategories', normalize(data.credCategories))
        : Promise.resolve(),
      data.credentials?.length
        ? db.bulkPut('credentials', normalize(data.credentials))
        : Promise.resolve(),
    ]);
  },
};
