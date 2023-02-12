import { Request, Response, NextFunction } from 'express';

export const userAuthCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) return next();
  res.redirect('auth/google');
};

export const headerSetting = (_: any, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  return next();
};
