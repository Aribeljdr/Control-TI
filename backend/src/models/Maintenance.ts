import mongoose, { Document, Schema } from 'mongoose';
import { EquipmentStatus, Photo } from '../types';

export interface IMaintenance extends Document {
  equipmentId: mongoose.Types.ObjectId;
  date: string;
  type: 'Preventivo' | 'Correctivo';
  technician: string;
  actions: string[];
  problemFound?: string;
  solutionApplied?: string;
  recommendations: string;
  result: EquipmentStatus;
  photos: Photo[];
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ['BEFORE', 'AFTER', 'MAIN'], required: true },
    url: { type: String, required: true },
    caption: String,
    date: { type: String, required: true },
  },
  { _id: false }
);

const MaintenanceSchema = new Schema<IMaintenance>(
  {
    equipmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Equipment',
      required: [true, 'El ID del equipo es requerido'],
    },
    date: {
      type: String,
      required: [true, 'La fecha es requerida'],
    },
    type: {
      type: String,
      enum: ['Preventivo', 'Correctivo'],
      required: [true, 'El tipo de mantenimiento es requerido'],
    },
    technician: {
      type: String,
      required: [true, 'El técnico es requerido'],
      trim: true,
    },
    actions: {
      type: [String],
      default: [],
    },
    problemFound: String,
    solutionApplied: String,
    recommendations: {
      type: String,
      default: '',
    },
    result: {
      type: String,
      enum: ['OK', 'Riesgo', 'Crítico'],
      required: [true, 'El resultado es requerido'],
    },
    photos: {
      type: [PhotoSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

MaintenanceSchema.index({ equipmentId: 1 });
MaintenanceSchema.index({ date: -1 });
MaintenanceSchema.index({ type: 1 });

export const Maintenance = mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
