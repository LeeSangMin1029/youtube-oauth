import { env } from '@/config';
import { Request, Response } from 'express';
import { createUser, findUser, getAPIProfile } from '@/service/auth';
import { oauth2Client, setGoogleAuth } from '@/utils/googleauth';

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

export const responseUser = async (req: Request, res: Response) => {
  let redirectURL = '';
  if (env.ENV === 'production') {
    redirectURL = 'main.d36sadhkoikcp5.amplifyapp.com';
  } else if (env.ENV === 'development') {
    redirectURL = 'localhost:5173';
  }
  const tokenInfo = await oauth2Client.getToken(req.query.code as string);
  oauth2Client.setCredentials(tokenInfo.tokens);
  const profile = await getAPIProfile();
  const { googleID, email, thumbnails, name, userURL } = profile;
  if (googleID && !(await findUser(googleID)))
    await createUser(tokenInfo.tokens, profile);
  res.redirect(
    `https://${redirectURL}/login?userID=${googleID}&email=${email}&name=${name}&thumbnails=${thumbnails}&userURL=${userURL}`
  );
};
