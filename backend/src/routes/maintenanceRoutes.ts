import { Router } from 'express';
import {
  getAllMaintenances,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '../controllers/maintenanceController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { maintenanceSchema } from '../middleware/schemas';

const router = Router();

router.use(authenticate);

router.get('/', getAllMaintenances);
router.get('/:id', getMaintenanceById);
router.post('/', authorize('admin', 'technician'), validate(maintenanceSchema), createMaintenance);
router.put('/:id', authorize('admin', 'technician'), updateMaintenance);
router.delete('/:id', authorize('admin'), deleteMaintenance);

export default router;
