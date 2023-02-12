import { Request, Response, NextFunction } from 'express';
import { google, youtube_v3 } from 'googleapis';
import { getOAuth } from '@/utils';

export const oauthCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oauth2Client = getOAuth();
    if (req.user) {
      const { access_token, refresh_token } = req.user;
      oauth2Client.credentials = { access_token, refresh_token };
      req.authInfo = oauth2Client;
      return next();
    }
  } catch (err) {
    console.error(err);
    res.send(err);
  }
};

export const youtubeAPICall = (req: Request, res: Response) => {
  const youtube: youtube_v3.Youtube = google.youtube({
    version: 'v3',
    auth: req.authInfo,
  });
  try {
  } catch (err) {
    res.send(err);
  }
  res.send('hello');
};
