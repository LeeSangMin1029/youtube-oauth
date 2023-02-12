import { Router } from 'express';
import { oauthCredentials, youtubeAPICall } from '@/controller';
import { userAuthCheck } from '@/middleware';

const router = Router();
router.get('/', userAuthCheck, oauthCredentials, youtubeAPICall);

export default router;
