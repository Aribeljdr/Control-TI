import { Response } from 'express';
import { AuthRequest } from '../types';
import { Equipment } from '../models/Equipment';
import { Maintenance } from '../models/Maintenance';
import { Bitacora } from '../models/Bitacora';
import { Manual, ManualFolder } from '../models/Manual';
import { Credential, CredentialCategory } from '../models/Credential';

export const exportDatabase = async (req: AuthRequest, res: Response) => {
  try {
    // Recolectar toda la data en paralelo
    const [
      equipments,
      maintenances,
      bitacoras,
      folders,
      manuals,
      categories,
      credentials
    ] = await Promise.all([
      Equipment.find().lean(),
      Maintenance.find().lean(),
      Bitacora.find().lean(),
      ManualFolder.find().lean(),
      Manual.find().lean(),
      CredentialCategory.find().lean(),
      Credential.find().lean()
    ]);

    const backup = {
      appName: "Mantenimiento Preventivo IT",
      schemaVersion: "2.0.0",
      exportedAt: new Date().toISOString(),
      exportedBy: req.user?.username || 'Sistema',
      counts: {
        equipment: equipments.length,
        maintenances: maintenances.length,
        bitacoraDays: bitacoras.length,
        manualFolders: folders.length,
        manualFiles: manuals.length,
        credentialCategories: categories.length,
        credentials: credentials.length
      },
      data: {
        equipments,
        maintenances,
        bitacora: bitacoras,
        folders,
        manuals,
        credCategories: categories,
        credentials
      }
    };

    res.status(200).json(backup);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al exportar base de datos: ' + error.message });
  }
};

export const importDatabase = async (req: AuthRequest, res: Response) => {
  try {
    const backup = req.body;

    if (backup.appName !== 'Mantenimiento Preventivo IT') {
      res.status(400).json({ success: false, message: 'Archivo de respaldo no válido para este sistema.' });
      return;
    }

    const { data } = backup;

    // Limpiar colecciones actuales antes de importar (BORRADO TOTAL)
    // Nota: En un sistema crítico esto se haría con transacciones o backups temporales
    await Promise.all([
      Equipment.deleteMany({}),
      Maintenance.deleteMany({}),
      Bitacora.deleteMany({}),
      ManualFolder.deleteMany({}),
      Manual.deleteMany({}),
      CredentialCategory.deleteMany({}),
      Credential.deleteMany({})
    ]);

    // Insertar nueva data
    // Usamos insertMany para eficiencia
    if (data.equipments?.length) await Equipment.insertMany(data.equipments);
    if (data.maintenances?.length) await Maintenance.insertMany(data.maintenances);
    if (data.bitacora?.length) await Bitacora.insertMany(data.bitacora);
    if (data.folders?.length) await ManualFolder.insertMany(data.folders);
    if (data.manuals?.length) await Manual.insertMany(data.manuals);
    if (data.credCategories?.length) await CredentialCategory.insertMany(data.credCategories);
    if (data.credentials?.length) await Credential.insertMany(data.credentials);

    res.status(200).json({
      success: true,
      message: 'Base de datos restaurada exitosamente. El sistema se reiniciará.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error durante la importación: ' + error.message });
  }
};
