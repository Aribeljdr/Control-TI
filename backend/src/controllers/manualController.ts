import { Request, Response } from 'express';
import { Manual, ManualFolder } from '../models/Manual';

export const getAllFolders = async (req: Request, res: Response): Promise<void> => {
  try {
    const folders = await ManualFolder.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: folders.length, data: folders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const folder = await ManualFolder.create(req.body);
    res.status(201).json({ success: true, message: 'Carpeta creada', data: folder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const folder = await ManualFolder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!folder) {
      res.status(404).json({ success: false, message: 'Carpeta no encontrada' });
      return;
    }

    res.status(200).json({ success: true, message: 'Carpeta actualizada', data: folder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const folder = await ManualFolder.findByIdAndDelete(req.params.id);
    if (!folder) {
      res.status(404).json({ success: false, message: 'Carpeta no encontrada' });
      return;
    }
    res.status(200).json({ success: true, message: 'Carpeta eliminada' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllManuals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folderId } = req.query;
    const filter: any = {};
    if (folderId) filter.folderId = folderId;

    const manuals = await Manual.find(filter).populate('folderId').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: manuals.length, data: manuals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getManualById = async (req: Request, res: Response): Promise<void> => {
  try {
    const manual = await Manual.findById(req.params.id).populate('folderId');
    if (!manual) {
      res.status(404).json({ success: false, message: 'Manual no encontrado' });
      return;
    }
    res.status(200).json({ success: true, data: manual });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createManual = async (req: Request, res: Response): Promise<void> => {
  try {
    const manual = await Manual.create(req.body);
    res.status(201).json({ success: true, message: 'Manual creado', data: manual });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateManual = async (req: Request, res: Response): Promise<void> => {
  try {
    const manual = await Manual.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!manual) {
      res.status(404).json({ success: false, message: 'Manual no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Manual actualizado', data: manual });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteManual = async (req: Request, res: Response): Promise<void> => {
  try {
    const manual = await Manual.findByIdAndDelete(req.params.id);
    if (!manual) {
      res.status(404).json({ success: false, message: 'Manual no encontrado' });
      return;
    }
    res.status(200).json({ success: true, message: 'Manual eliminado' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
