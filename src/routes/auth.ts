import 'express-async-errors';
import { Router } from 'express';
import cors from 'cors';
import { responseURL, responseUser } from '@/controller/auth';

const router = Router();
router.post('/google', cors(), responseURL);
router.get('/google/redirect', cors(), responseUser);

export default router;
