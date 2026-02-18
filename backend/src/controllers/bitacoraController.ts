import { Request, Response } from 'express';
import { Bitacora } from '../models/Bitacora';

export const getAllBitacoras = async (req: Request, res: Response): Promise<void> => {
  try {
    const bitacoras = await Bitacora.find().sort({ date: -1 });
    res.status(200).json({ success: true, count: bitacoras.length, data: bitacoras });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBitacoraByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    const bitacora = await Bitacora.findOne({ date });

    if (!bitacora) {
      res.status(404).json({ success: false, message: 'Bitácora no encontrada' });
      return;
    }

    res.status(200).json({ success: true, data: bitacora });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrUpdateBitacora = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.body;

    const bitacora = await Bitacora.findOneAndUpdate(
      { date },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Bitácora guardada exitosamente',
      data: bitacora,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBitacora = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    const bitacora = await Bitacora.findOneAndDelete({ date });

    if (!bitacora) {
      res.status(404).json({ success: false, message: 'Bitácora no encontrada' });
      return;
    }

    res.status(200).json({ success: true, message: 'Bitácora eliminada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
