import { Router } from 'express';
import {
  getAllBitacoras,
  getBitacoraByDate,
  createOrUpdateBitacora,
  deleteBitacora,
} from '../controllers/bitacoraController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getAllBitacoras);
router.get('/:date', getBitacoraByDate);
router.post('/', authorize('admin', 'technician'), createOrUpdateBitacora);
router.delete('/:date', authorize('admin'), deleteBitacora);

export default router;
