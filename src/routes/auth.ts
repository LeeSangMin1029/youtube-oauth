import { Router } from 'express';
import cors from 'cors';
import { responseURL, getAuthToken, getValidToken } from '@/controller/auth';

const router = Router();
router.post('/google', cors(), responseURL);
router.get('/google/redirect', getAuthToken);
router.post('/token', getValidToken);

export default router;
