import 'express-async-errors';
import { validUser } from '@/middleware';
import { Router } from 'express';
import { getAPIVideos } from '@/controller/youtube';

const router = Router();

router.post('/videos', validUser, getAPIVideos);
export default router;
