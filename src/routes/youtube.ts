import 'express-async-errors';
import { authorized } from '@/middleware';
import { Router } from 'express';
import {
  getVideoItems,
  getPlayLists,
  getChannelLists,
  getCommentsList,
  createCommentReply,
  createCommentOfVideo,
} from '@/controller/youtube';

const router = Router();

router.post('/videos', authorized, getVideoItems);
router.post('/playlists', authorized, getPlayLists);
router.post('/subscriptions', authorized, getChannelLists);
router.post('/comments', authorized, getCommentsList);
router.post('/comments/create', authorized, createCommentReply);
router.post('/commentThreads', authorized, createCommentOfVideo);
export default router;
