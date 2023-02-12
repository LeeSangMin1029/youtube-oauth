import { Router } from 'express';
import { passAuthAccess, passAuthRedirect } from '@/controller';

const router = Router();
router.get('/google', passAuthAccess);
router.get('/google/redirect', passAuthRedirect);

export default router;
