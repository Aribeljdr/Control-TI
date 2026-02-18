import { Router } from 'express';
import {
  getAllEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../controllers/equipmentController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { equipmentSchema } from '../middleware/schemas';

const router = Router();

router.use(authenticate);

router.get('/', getAllEquipments);
router.get('/:id', getEquipmentById);
router.post('/', authorize('admin', 'technician'), validate(equipmentSchema), createEquipment);
router.put('/:id', authorize('admin', 'technician'), validate(equipmentSchema), updateEquipment);
router.delete('/:id', authorize('admin'), deleteEquipment);

export default router;
