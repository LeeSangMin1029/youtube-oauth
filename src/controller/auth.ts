import { Request, Response } from 'express';
import User from '@/models/User';
import { encryptHMAC, getAPIData, getOAuth } from '@/utils';
import { getErrorMessage } from '@/errors';
import { googleURL, googleParams } from '@/api/google';
import { mineChannels, youtubeURL } from '@/api/youtube';

export const responseURL = (req: Request, res: Response) => {
  const oauth2Client = getOAuth();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtubepartner',
      'profile',
      'email',
    ],
    prompt: 'consent',
  });
  res.send({ url });
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const oauth2Client = getOAuth();
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code as string);
    const { access_token: accessToken, refresh_token: refreshToken } = tokens;
    const gData = await getAPIData(googleURL, accessToken!, googleParams);
    const yData = await getAPIData(youtubeURL, accessToken!, mineChannels);
    const { customUrl: userURL, thumbnails } = yData.items[0].snippet;
    const name = gData.names[0].displayName;
    const googleID = gData.resourceName.split('/')[1];
    const email = gData.emailAddresses[0].value;
    const user = await User.findOne({ googleID });
    if (!user) {
      User.create({
        googleID,
        email,
        name,
        thumbnails: thumbnails.default.url,
        userURL,
        refreshToken,
        accessToken,
      });
    }
    const encryptedID = encryptHMAC(googleID);
    res.redirect(
      `https://localhost:5173/login?userID=${encryptedID}&email=${email}&name=${name}&thumbnails=${thumbnails.default.url}&userURL=${userURL}`
    );
  } catch (err) {
    console.error(getErrorMessage(err));
  }
};
