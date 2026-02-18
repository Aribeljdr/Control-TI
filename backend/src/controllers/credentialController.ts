import { Request, Response } from 'express';
import { Credential, CredentialCategory } from '../models/Credential';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CredentialCategory.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await CredentialCategory.create(req.body);
    res.status(201).json({ success: true, message: 'Categoría creada', data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCredentials = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, status, company } = req.query;
    const filter: any = {};
    if (categoryId) filter.categoryId = categoryId;
    if (status) filter.status = status;
    if (company) filter.company = company;

    const credentials = await Credential.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: credentials.length, data: credentials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCredentialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const credential = await Credential.findById(req.params.id);
    if (!credential) {
      res.status(404).json({ success: false, message: 'Credencial no encontrada' });
      return;
    }
    res.status(200).json({ success: true, data: credential });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCredential = async (req: Request, res: Response): Promise<void> => {
  try {
    const credential = await Credential.create(req.body);
    res.status(201).json({ success: true, message: 'Credencial creada', data: credential });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCredential = async (req: Request, res: Response): Promise<void> => {
  try {
    const credential = await Credential.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!credential) {
      res.status(404).json({ success: false, message: 'Credencial no encontrada' });
      return;
    }

    res.status(200).json({ success: true, message: 'Credencial actualizada', data: credential });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCredential = async (req: Request, res: Response): Promise<void> => {
  try {
    const credential = await Credential.findByIdAndDelete(req.params.id);
    if (!credential) {
      res.status(404).json({ success: false, message: 'Credencial no encontrada' });
      return;
    }
    res.status(200).json({ success: true, message: 'Credencial eliminada' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
