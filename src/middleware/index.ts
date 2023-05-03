import { Request, Response, NextFunction } from 'express';
import User from '@/models/User';
import { errorHandler } from '@/errors';

export const headerSetting = (_: any, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  return next();
};

export const validUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { googleID, email } = req.body;
  const user = await User.findOne({ googleID, email });
  res.token = user?.refreshToken!;
};

export const loggerHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Error encountered:', err.message || err);
  next(err);
};

export const errorHandlerWithResponse = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorHandler.handleError(err, res);
};
