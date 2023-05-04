import { Request, Response } from 'express';
import { getAPIProfile } from '@/service/auth';
import User from '@/models/User';
import { oauth2Client, getToken, setGoogleAuth } from '@/utils';

export const responseURL = (_: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtubepartner',
      'email',
      'profile',
    ],
    prompt: 'consent',
  });
  setGoogleAuth();
  res.send({ url });
};

export const createUser = async (req: Request, res: Response) => {
  const tokenInfo = await getToken(req.query.code as string);
  oauth2Client.setCredentials(tokenInfo.tokens);
  const { thumbnails, userURL, name, email, googleID } = await getAPIProfile();
  const user = await User.findOne({ googleID, email });
  if (!user) {
    const { access_token, refresh_token } = tokenInfo.tokens;
    User.create({
      googleID,
      email,
      name,
      thumbnails,
      userURL,
      accessToken: access_token,
      refreshToken: refresh_token,
    });
  }
  res.redirect(
    `https://localhost:5173/login?userID=${googleID}&email=${email}&name=${name}&thumbnails=${thumbnails}&userURL=${userURL}`
  );
};
