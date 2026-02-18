
export type EquipmentStatus = 'OK' | 'Riesgo' | 'Crítico';
export type EquipmentType = 'PC' | 'Laptop' | 'AIO' | 'Smartphone' | 'Monitor' | 'Mouse' | 'Keyboard';
export type PhotoType = 'BEFORE' | 'AFTER' | 'MAIN';

// Bitácora TI
export type DayStatus = 'OK' | 'RISK' | 'INCIDENT' | 'NONE' | 'SUNDAY';
export type RequestPriority = 'Baja' | 'Media' | 'Alta';
export type RequestStatus = 'Pendiente' | 'En proceso' | 'Resuelto';
export type ActivityCategory = 'Mantenimiento' | 'Soporte' | 'Redes' | 'Inventario' | 'Sistemas' | 'Reunión' | 'Documentación';

// Manuales TI / Wiki
export interface ManualPhoto {
  id: string;
  base64: string;
  caption?: string;
  createdAt: string;
}

export interface ManualFile {
  id: string;
  folderId: string;
  title: string;
  content: string;
  tags: string[];
  coverImageId?: string;
  images: ManualPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface ManualFolder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Gestión de Credenciales / Servicios
export type CredentialType = 'EMAIL' | 'WIFI' | 'CPANEL' | 'WORDPRESS' | 'PORTAINER' | 'CONTANET' | 'PC_ACCOUNT' | 'OTHER';
export type CredentialStatus = 'ACTIVO' | 'ASIGNADO' | 'LIBRE' | 'DESACTUALIZADO' | 'BAJA';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'STATUS_CHANGE';

export interface AuditChange {
  field: string;
  before: string;
  after: string;
}

export interface AuditEntry {
  id: string;
  date: string;
  action: AuditAction;
  actor: string;
  note?: string;
  changes?: AuditChange[];
}

export interface CredentialRecord {
  id: string;
  categoryId: string;
  type: CredentialType;
  status: CredentialStatus;
  title: string;
  company: 'Aleph' | 'Bioelectron' | 'Otro';
  username: string;
  password: string;
  assignedTo?: string;
  area?: string;
  notes?: string;
  tags: string[];
  // Verificación
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNote?: string;
  // Auditoría
  history: AuditEntry[];
  // Campos Dinámicos
  dynamicFields: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  createdAt: string;
}

export interface ITRequest {
  id: string;
  title: string;
  area: string;
  priority: RequestPriority;
  status: RequestStatus;
  description: string;
}

export interface ITActivity {
  id: string;
  category: ActivityCategory;
  title: string;
  description: string;
  result: 'OK' | 'Observación' | 'Pendiente';
}

export interface BitacoraDay {
  date: string;
  status: DayStatus;
  requests: ITRequest[];
  activities: ITActivity[];
  summary?: string;
}

export interface ComponentInfo {
  model: string;
  year: number;
}

export interface EquipmentComponents {
  cpu: ComponentInfo;
  ram: ComponentInfo;
  disk: ComponentInfo;
  motherboard: ComponentInfo;
  psu?: ComponentInfo;
  gpu?: ComponentInfo;
  monitor?: ComponentInfo;
}

export interface Photo {
  id: string;
  type: PhotoType;
  url: string;
  caption?: string;
  date: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  date: string;
  type: 'Preventivo' | 'Correctivo';
  technician: string;
  actions: string[];
  problemFound?: string;
  solutionApplied?: string;
  recommendations: string;
  result: EquipmentStatus;
  photos: Photo[];
}

export interface PeripheralAssignment {
  equipmentId: string; // ID del periférico (Mouse/Keyboard/Monitor) asignado
  assignedDate: string; // Fecha de asignación
}

export interface Equipment {
  id: string;
  code: string;
  hostname: string;
  user: string;
  area: string;
  brand?: string;
  model?: string;
  serial?: string; // Opcional para PC y periféricos
  os?: string; // Opcional para periféricos
  purchaseDate: string;
  purchaseYear: number;
  type: EquipmentType;
  status: EquipmentStatus;
  lastMaintenance?: string;
  nextMaintenance: string;
  photoUrl?: string;
  components?: EquipmentComponents; // Opcional para periféricos
  risks?: {
    slowness: boolean;
    restarts: boolean;
    diskHealth: boolean;
    temperature: boolean;
    screen: boolean;
    network: boolean;
    software: boolean;
  };
  recommendation?: 'Mantener' | 'Actualizar' | 'Aumentar RAM' | 'Cambiar disco' | 'Renovar equipo';
  observations: string;
  description?: string;
  // Para PC/Laptop: periféricos asignados
  assignedKeyboard?: PeripheralAssignment;
  assignedMouse?: PeripheralAssignment;
  assignedMonitor?: PeripheralAssignment;
  // Para periféricos: a qué PC está asignado
  assignedTo?: string; // ID del equipo PC/Laptop al que está asignado
}
