import { Router } from 'express';
import {
  getAllFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  getAllManuals,
  getManualById,
  createManual,
  updateManual,
  deleteManual,
} from '../controllers/manualController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/folders', getAllFolders);
router.post('/folders', authorize('admin', 'technician'), createFolder);
router.put('/folders/:id', authorize('admin', 'technician'), updateFolder);
router.delete('/folders/:id', authorize('admin'), deleteFolder);

router.get('/', getAllManuals);
router.get('/:id', getManualById);
router.post('/', authorize('admin', 'technician'), createManual);
router.put('/:id', authorize('admin', 'technician'), updateManual);
router.delete('/:id', authorize('admin'), deleteManual);

export default router;
