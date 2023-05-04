import { Request, Response, NextFunction } from 'express';
import User from '@/models/User';
import { AppError, HttpCode, errorHandler } from '@/errors';

export const headerSetting = (_: any, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  return next();
};

export const authorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { googleID, email } = req.body;
  if (!(googleID || email)) {
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: '클라이언트 인증 정보가 잘못되었습니다.',
    });
  }
  const user = await User.findOne({ googleID, email });
  res.token = user?.refreshToken;
  next();
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
