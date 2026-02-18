import { Request, Response } from 'express';
import { Equipment } from '../models/Equipment';
import { EquipmentType } from '../types';

// Función auxiliar para generar el siguiente código
const generateNextCode = async (type: EquipmentType): Promise<string> => {
  const prefixes: Record<EquipmentType, string> = {
    'PC': 'PC',
    'Laptop': 'LP',
    'Monitor': 'MT',
    'Mouse': 'MS',
    'Keyboard': 'KB',
    'Smartphone': 'SP',
    'AIO': 'AIO'
  };

  const prefix = prefixes[type];

  // Buscar el último equipo de este tipo ordenado por código descendente
  const lastEquipment = await Equipment.findOne({ type })
    .sort({ code: -1 })
    .limit(1);

  if (!lastEquipment) {
    return `${prefix}-001`;
  }

  // Extraer el número del código
  const match = lastEquipment.code.match(/(\d+)$/);
  const lastNumber = match ? parseInt(match[1], 10) : 0;
  const nextNumber = lastNumber + 1;

  return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
};

export const getAllEquipments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { area, status, type } = req.query;

    const filter: any = {};
    if (area) filter.area = area;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const equipments = await Equipment.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: equipments.length,
      data: equipments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener equipos',
    });
  }
};

export const getEquipmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      res.status(404).json({
        success: false,
        message: 'Equipo no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener equipo',
    });
  }
};

export const createEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    // Generar código automáticamente si no viene en el body
    if (!req.body.code || req.body.code.trim() === '') {
      req.body.code = await generateNextCode(req.body.type);
    }

    const equipment = await Equipment.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Equipo creado exitosamente',
      data: equipment,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'El código o serial del equipo ya existe',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear equipo',
    });
  }
};

export const updateEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Evitar que se modifique el código
    delete req.body.code;

    const equipment = await Equipment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!equipment) {
      res.status(404).json({
        success: false,
        message: 'Equipo no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Equipo actualizado exitosamente',
      data: equipment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar equipo',
    });
  }
};

export const deleteEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const equipment = await Equipment.findByIdAndDelete(id);

    if (!equipment) {
      res.status(404).json({
        success: false,
        message: 'Equipo no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Equipo eliminado exitosamente',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al eliminar equipo',
    });
  }
};
