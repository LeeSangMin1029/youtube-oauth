import { Request, Response } from 'express';
import { getOAuth } from '@/utils';
import { env } from '@/config';
import fetch from 'node-fetch';
import { getErrorMessage } from '@/errors';

interface GoogleToken {
  access_token: string;
}

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

export const getAuthToken = async (req: Request, res: Response) => {
  const code = req.query.code;
  const oauth2Client = getOAuth();
  if (code) {
    const { tokens } = await oauth2Client.getToken(code as string);
    const { access_token, refresh_token, expiry_date } = tokens;
    res.redirect(
      `http://localhost:5173/token?accessToken=${access_token}&refreshToken=${refresh_token}`
    );
  }
};

export const getValidToken = async (req: Request, res: Response) => {
  try {
    const { client_id, client_secret } = env;
    const request = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        refresh_token: req.body.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = (await request.json()) as GoogleToken;
    res.json({
      accessToken: data.access_token,
    });
  } catch (error) {
    res.json({ error: getErrorMessage(error) });
  }
};
