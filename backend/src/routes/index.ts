import { Router } from 'express';
import authRoutes from './authRoutes';
import equipmentRoutes from './equipmentRoutes';
import maintenanceRoutes from './maintenanceRoutes';
import bitacoraRoutes from './bitacoraRoutes';
import credentialRoutes from './credentialRoutes';
import manualRoutes from './manualRoutes';
import backupRoutes from './backupRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/maintenances', maintenanceRoutes);
router.use('/bitacora', bitacoraRoutes);
router.use('/credentials', credentialRoutes);
router.use('/manuals', manualRoutes);
router.use('/backup', backupRoutes);

export default router;
