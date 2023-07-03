import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import User from '@/models/User';
import { AppError, HttpCode, errorHandler } from '@/errors';
import { getValidatedToken } from '@/utils/token';
import { oauth2Client, setGoogleAuth } from '@/utils/googleauth';
import { updateUser } from '@/service/auth';

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
  const { googleID } = req.body;
  if (!googleID || googleID === '') {
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: '클라이언트 인증 정보가 잘못되었습니다.',
    });
  }
  const user = await User.findOne({ googleID });
  if (user) {
    const { accessToken, refreshToken } = user;
    const validToken = await getValidatedToken(accessToken, refreshToken);
    if (accessToken !== validToken) {
      oauth2Client.setCredentials({ access_token: validToken });
      await updateUser(googleID, { accessToken: validToken });
    } else {
      oauth2Client.setCredentials({ access_token: accessToken });
    }
  }
  setGoogleAuth();
  next();
};

export const shouldCompress = (req: Request, res: Response) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
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
