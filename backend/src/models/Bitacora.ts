import mongoose, { Document, Schema } from 'mongoose';
import { DayStatus, ITRequest, ITActivity } from '../types';

export interface IBitacora extends Document {
  date: string;
  status: DayStatus;
  requests: ITRequest[];
  activities: ITActivity[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ITRequestSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    area: { type: String, required: true },
    priority: { type: String, enum: ['Baja', 'Media', 'Alta'], required: true },
    status: { type: String, enum: ['Pendiente', 'En proceso', 'Resuelto'], required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ITActivitySchema = new Schema(
  {
    id: { type: String, required: true },
    category: {
      type: String,
      enum: ['Mantenimiento', 'Soporte', 'Redes', 'Inventario', 'Sistemas', 'Reunión', 'Documentación'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    result: { type: String, enum: ['OK', 'Observación', 'Pendiente'], required: true },
  },
  { _id: false }
);

const BitacoraSchema = new Schema<IBitacora>(
  {
    date: {
      type: String,
      required: [true, 'La fecha es requerida'],
      unique: true,
    },
    status: {
      type: String,
      enum: ['OK', 'RISK', 'INCIDENT', 'NONE', 'SUNDAY'],
      default: 'NONE',
    },
    requests: {
      type: [ITRequestSchema],
      default: [],
    },
    activities: {
      type: [ITActivitySchema],
      default: [],
    },
    summary: String,
  },
  {
    timestamps: true,
  }
);

BitacoraSchema.index({ date: -1 });

export const Bitacora = mongoose.model<IBitacora>('Bitacora', BitacoraSchema);
