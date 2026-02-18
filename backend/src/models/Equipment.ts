import mongoose, { Document, Schema } from 'mongoose';
import { EquipmentStatus, EquipmentType, EquipmentComponents } from '../types';

export interface PeripheralAssignment {
  equipmentId: string;
  assignedDate: string;
}

export interface IEquipment extends Document {
  code: string;
  hostname: string;
  user: string;
  area: string;
  brand?: string;
  model?: string;
  serial?: string;
  os?: string;
  purchaseDate: string;
  purchaseYear: number;
  type: EquipmentType;
  status: EquipmentStatus;
  lastMaintenance?: string;
  nextMaintenance: string;
  photoUrl?: string;
  components?: EquipmentComponents;
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
  assignedKeyboard?: PeripheralAssignment;
  assignedMouse?: PeripheralAssignment;
  assignedMonitor?: PeripheralAssignment;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PeripheralAssignmentSchema = new Schema(
  {
    equipmentId: { type: String, required: true },
    assignedDate: { type: String, required: true },
  },
  { _id: false }
);

const ComponentInfoSchema = new Schema(
  {
    model: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { _id: false }
);

const EquipmentComponentsSchema = new Schema(
  {
    cpu: { type: ComponentInfoSchema, required: true },
    ram: { type: ComponentInfoSchema, required: true },
    disk: { type: ComponentInfoSchema, required: true },
    motherboard: { type: ComponentInfoSchema, required: true },
    psu: ComponentInfoSchema,
    gpu: ComponentInfoSchema,
    monitor: ComponentInfoSchema,
  },
  { _id: false }
);

const RisksSchema = new Schema(
  {
    slowness: { type: Boolean, default: false },
    restarts: { type: Boolean, default: false },
    diskHealth: { type: Boolean, default: false },
    temperature: { type: Boolean, default: false },
    screen: { type: Boolean, default: false },
    network: { type: Boolean, default: false },
    software: { type: Boolean, default: false },
  },
  { _id: false }
);

const EquipmentSchema = new Schema<IEquipment>(
  {
    code: {
      type: String,
      required: [true, 'El código es requerido'],
      unique: true,
      trim: true,
    },
    hostname: {
      type: String,
      required: [true, 'El hostname es requerido'],
      trim: true,
    },
    user: {
      type: String,
      required: [true, 'El usuario es requerido'],
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'El área es requerida'],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    serial: {
      type: String,
      trim: true,
      sparse: true,
    },
    os: {
      type: String,
      trim: true,
    },
    purchaseDate: {
      type: String,
      required: [true, 'La fecha de compra es requerida'],
    },
    purchaseYear: {
      type: Number,
      required: [true, 'El año de compra es requerido'],
    },
    type: {
      type: String,
      enum: ['PC', 'Laptop', 'AIO', 'Smartphone', 'Monitor', 'Mouse', 'Keyboard'],
      required: [true, 'El tipo de equipo es requerido'],
    },
    status: {
      type: String,
      enum: ['OK', 'Riesgo', 'Crítico'],
      default: 'OK',
    },
    lastMaintenance: String,
    nextMaintenance: {
      type: String,
      required: [true, 'La fecha de próximo mantenimiento es requerida'],
    },
    photoUrl: String,
    components: {
      type: EquipmentComponentsSchema,
    },
    risks: {
      type: RisksSchema,
    },
    recommendation: {
      type: String,
      enum: ['Mantener', 'Actualizar', 'Aumentar RAM', 'Cambiar disco', 'Renovar equipo'],
    },
    observations: {
      type: String,
      default: '',
    },
    description: {
      type: String,
    },
    assignedKeyboard: {
      type: PeripheralAssignmentSchema,
    },
    assignedMouse: {
      type: PeripheralAssignmentSchema,
    },
    assignedMonitor: {
      type: PeripheralAssignmentSchema,
    },
    assignedTo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

EquipmentSchema.index({ code: 1 });
EquipmentSchema.index({ serial: 1 });
EquipmentSchema.index({ area: 1 });
EquipmentSchema.index({ status: 1 });

export const Equipment = mongoose.model<IEquipment>('Equipment', EquipmentSchema);
