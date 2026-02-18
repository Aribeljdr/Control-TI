import { Request, Response } from 'express';
import { Maintenance } from '../models/Maintenance';
import { Equipment } from '../models/Equipment';

export const getAllMaintenances = async (req: Request, res: Response): Promise<void> => {
  try {
    const { equipmentId, type } = req.query;

    const filter: any = {};
    if (equipmentId) filter.equipmentId = equipmentId;
    if (type) filter.type = type;

    const maintenances = await Maintenance.find(filter)
      .populate('equipmentId', 'code hostname user area')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: maintenances.length,
      data: maintenances,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener mantenimientos',
    });
  }
};

export const getMaintenanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const maintenance = await Maintenance.findById(id).populate('equipmentId');

    if (!maintenance) {
      res.status(404).json({
        success: false,
        message: 'Mantenimiento no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: maintenance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener mantenimiento',
    });
  }
};

export const createMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { equipmentId, result } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      res.status(404).json({
        success: false,
        message: 'Equipo no encontrado',
      });
      return;
    }

    const maintenance = await Maintenance.create(req.body);

    equipment.status = result;
    equipment.lastMaintenance = req.body.date;
    await equipment.save();

    res.status(201).json({
      success: true,
      message: 'Mantenimiento creado exitosamente',
      data: maintenance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear mantenimiento',
    });
  }
};

export const updateMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const maintenance = await Maintenance.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!maintenance) {
      res.status(404).json({
        success: false,
        message: 'Mantenimiento no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Mantenimiento actualizado exitosamente',
      data: maintenance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar mantenimiento',
    });
  }
};

export const deleteMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const maintenance = await Maintenance.findByIdAndDelete(id);

    if (!maintenance) {
      res.status(404).json({
        success: false,
        message: 'Mantenimiento no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Mantenimiento eliminado exitosamente',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al eliminar mantenimiento',
    });
  }
};
