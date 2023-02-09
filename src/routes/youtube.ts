import { NextFunction, Request, Response, Router } from 'express';

const userLogged = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  res.redirect('auth/google');
};

const router = Router();

router.get('/', userLogged, function (req: Request, res: Response) {
  res.send(req.user);
});

export default router;
