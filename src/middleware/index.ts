import { Request, Response, NextFunction } from 'express';
import User from '@/models/User';
import { matchedHMAC } from '@/utils';

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
  try {
    const { googleID, email } = req.body;
    const user = await User.findOne({ email });
    if (user && matchedHMAC(user?.googleID!, googleID)) {
      res.token = user?.refreshToken!;
    }
    next();
  } catch (err) {
    next(err);
  }
};
