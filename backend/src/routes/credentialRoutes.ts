import { Router } from 'express';
import {
  getAllCategories,
  createCategory,
  getAllCredentials,
  getCredentialById,
  createCredential,
  updateCredential,
  deleteCredential,
} from '../controllers/credentialController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { credentialSchema } from '../middleware/schemas';

const router = Router();

router.use(authenticate);

router.get('/categories', getAllCategories);
router.post('/categories', authorize('admin'), createCategory);

router.get('/', getAllCredentials);
router.get('/:id', getCredentialById);
router.post('/', authorize('admin', 'technician'), validate(credentialSchema), createCredential);
router.put('/:id', authorize('admin', 'technician'), updateCredential);
router.delete('/:id', authorize('admin'), deleteCredential);

export default router;
