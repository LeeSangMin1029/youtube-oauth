import { Router } from 'express';
import { oauthCredentials, youtubeAPICall } from '@/controller/youtube';
import { userAuthCheck } from '@/middleware';

const router = Router();
router.get('/videos', userAuthCheck, oauthCredentials, youtubeAPICall);

export default router;
