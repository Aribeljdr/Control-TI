import mongoose, { Document, Schema } from 'mongoose';
import { ManualPhoto } from '../types';

export interface IManualFolder extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IManual extends Document {
  folderId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  coverImageId?: string;
  images: ManualPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

const ManualFolderSchema = new Schema<IManualFolder>(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la carpeta es requerido'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ManualPhotoSchema = new Schema(
  {
    id: { type: String, required: true },
    base64: { type: String, required: true },
    caption: String,
    createdAt: { type: String, required: true },
  },
  { _id: false }
);

const ManualSchema = new Schema<IManual>(
  {
    folderId: {
      type: Schema.Types.ObjectId,
      ref: 'ManualFolder',
      required: [true, 'El ID de la carpeta es requerido'],
    },
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImageId: String,
    images: {
      type: [ManualPhotoSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

ManualSchema.index({ folderId: 1 });
ManualSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const ManualFolder = mongoose.model<IManualFolder>('ManualFolder', ManualFolderSchema);
export const Manual = mongoose.model<IManual>('Manual', ManualSchema);
