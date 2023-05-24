import 'express-async-errors';
import { authorized } from '@/middleware';
import { Router } from 'express';
import { getVideoItems } from '@/controller/youtube';

const router = Router();

router.post('/videos', authorized, getVideoItems);
export default router;
