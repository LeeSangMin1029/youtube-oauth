import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google'));

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    successRedirect: '/api/youtube',
    failureRedirect: '/',
  })
);

export default router;
