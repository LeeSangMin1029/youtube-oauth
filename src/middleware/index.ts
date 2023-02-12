import { Request, Response, NextFunction } from 'express';

export const userAuthCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) return next();
  res.redirect('auth/google');
};
