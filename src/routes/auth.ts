import { Router } from 'express';
import cors from 'cors';
import { responseURL, getAuthToken } from '@/controller/auth';

const router = Router();
router.post('/google', cors(), responseURL);
router.get('/google/redirect', getAuthToken);

export default router;
