import { Router } from 'express';
import { exportDatabase, importDatabase } from '../controllers/backupController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Solo el administrador puede gestionar respaldos
router.use(authenticate);
router.use(authorize('admin'));

router.get('/export', exportDatabase);
router.post('/import', importDatabase);

export default router;
