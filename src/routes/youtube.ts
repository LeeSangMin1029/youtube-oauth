import 'express-async-errors';
import { authorized } from '@/middleware';
import { Router } from 'express';
import { getAPIVideos } from '@/controller/youtube';

const router = Router();

router.post('/videos', authorized, getAPIVideos);
export default router;
