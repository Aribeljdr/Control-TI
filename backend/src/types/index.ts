import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type EquipmentStatus = 'OK' | 'Riesgo' | 'Crítico';
export type EquipmentType = 'PC' | 'Laptop' | 'AIO' | 'Smartphone' | 'Monitor' | 'Mouse' | 'Keyboard';
export type PhotoType = 'BEFORE' | 'AFTER' | 'MAIN';

export type DayStatus = 'OK' | 'RISK' | 'INCIDENT' | 'NONE' | 'SUNDAY';
export type RequestPriority = 'Baja' | 'Media' | 'Alta';
export type RequestStatus = 'Pendiente' | 'En proceso' | 'Resuelto';
export type ActivityCategory = 'Mantenimiento' | 'Soporte' | 'Redes' | 'Inventario' | 'Sistemas' | 'Reunión' | 'Documentación';

export type CredentialType = 'EMAIL' | 'WIFI' | 'CPANEL' | 'WORDPRESS' | 'PORTAINER' | 'CONTANET' | 'PC_ACCOUNT' | 'OTHER';
export type CredentialStatus = 'ACTIVO' | 'ASIGNADO' | 'LIBRE' | 'DESACTUALIZADO' | 'BAJA';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'STATUS_CHANGE';

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

export interface ManualPhoto {
  id: string;
  base64: string;
  caption?: string;
  createdAt: string;
}

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

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'technician' | 'viewer';
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  username: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
