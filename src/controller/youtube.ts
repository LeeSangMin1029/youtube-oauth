import { Request, Response, NextFunction } from 'express';
import { google, youtube_v3 } from 'googleapis';
import { GaxiosError } from 'googleapis-common';
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

export const youtubeAPICall = async (req: Request, res: Response) => {
  const youtube: youtube_v3.Youtube = google.youtube({
    version: 'v3',
    auth: req.authInfo,
  });
  try {
    const listParams: youtube_v3.Params$Resource$Videos$List = {
      id: ['Lfu2XXeT59Y'],
      part: ['id', 'snippet', 'statistics', 'player'],
      fields:
        'items(id,snippet(channelId,channelTitle,publishedAt,thumbnails(maxres),title),player,statistics(viewCount))',
    };
    const resList = await youtube.videos.list(listParams);
    const videoResults: youtube_v3.Schema$Video = resList.data;
    return res.json({ code: '200', data: videoResults });
  } catch (e) {
    if ((e as GaxiosError).response) {
      const err = e as GaxiosError;
      console.error(err.response);
      res.send(err);
    }
  }
};
