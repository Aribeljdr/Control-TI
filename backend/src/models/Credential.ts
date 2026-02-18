import mongoose, { Document, Schema } from 'mongoose';
import { CredentialType, CredentialStatus, AuditEntry } from '../types';

export interface ICredentialCategory extends Document {
  name: string;
  icon: string;
  color: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICredential extends Document {
  categoryId: mongoose.Types.ObjectId;
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
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNote?: string;
  history: AuditEntry[];
  dynamicFields: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const CredentialCategorySchema = new Schema<ICredentialCategory>(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la categoría es requerido'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'El icono es requerido'],
    },
    color: {
      type: String,
      required: [true, 'El color es requerido'],
    },
    description: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const AuditEntrySchema = new Schema(
  {
    id: { type: String, required: true },
    date: { type: String, required: true },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'VERIFY', 'STATUS_CHANGE'],
      required: true,
    },
    actor: { type: String, required: true },
    note: String,
    changes: [
      {
        field: String,
        before: String,
        after: String,
      },
    ],
  },
  { _id: false }
);

const CredentialSchema = new Schema<ICredential>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'CredentialCategory',
      required: [true, 'El ID de la categoría es requerido'],
    },
    type: {
      type: String,
      enum: ['EMAIL', 'WIFI', 'CPANEL', 'WORDPRESS', 'PORTAINER', 'CONTANET', 'PC_ACCOUNT', 'OTHER'],
      required: [true, 'El tipo es requerido'],
    },
    status: {
      type: String,
      enum: ['ACTIVO', 'ASIGNADO', 'LIBRE', 'DESACTUALIZADO', 'BAJA'],
      default: 'ACTIVO',
    },
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
    },
    company: {
      type: String,
      enum: ['Aleph', 'Bioelectron', 'Otro'],
      required: [true, 'La compañía es requerida'],
    },
    username: {
      type: String,
      required: [true, 'El usuario es requerido'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
    },
    assignedTo: String,
    area: String,
    notes: String,
    tags: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: String,
    verifiedBy: String,
    verificationNote: String,
    history: {
      type: [AuditEntrySchema],
      default: [],
    },
    dynamicFields: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        // Convertir categoryId a string
        if (ret.categoryId) {
          ret.categoryId = ret.categoryId.toString();
        }
        // Convertir dynamicFields Map a objeto plano
        if (ret.dynamicFields instanceof Map) {
          ret.dynamicFields = Object.fromEntries(ret.dynamicFields);
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        // Convertir categoryId a string
        if (ret.categoryId) {
          ret.categoryId = ret.categoryId.toString();
        }
        // Convertir dynamicFields Map a objeto plano
        if (ret.dynamicFields instanceof Map) {
          ret.dynamicFields = Object.fromEntries(ret.dynamicFields);
        }
        return ret;
      },
    },
  }
);

CredentialSchema.index({ categoryId: 1 });
CredentialSchema.index({ type: 1 });
CredentialSchema.index({ status: 1 });
CredentialSchema.index({ company: 1 });

export const CredentialCategory = mongoose.model<ICredentialCategory>('CredentialCategory', CredentialCategorySchema);
export const Credential = mongoose.model<ICredential>('Credential', CredentialSchema);
