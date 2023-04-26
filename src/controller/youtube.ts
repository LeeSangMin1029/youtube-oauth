import { getAPIData, getGrantToken } from '@/utils';
import { NextFunction, Response } from 'express';
import { youtubeURL, allVideos } from '@/api/youtube';

export const getAPIVideos = async (
  _: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = await getGrantToken(res.token!);
    const videosData = await getAPIData(youtubeURL, accessToken, allVideos);
    res.json({ videosData });
  } catch (err) {
    next(err);
  }
};
