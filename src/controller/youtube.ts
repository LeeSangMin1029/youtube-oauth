import { Response } from 'express';
import { oauth2Client, setGoogleAuth } from '@/utils/googleauth';
import { google, youtube_v3 } from 'googleapis';
import { getValidatedToken } from '@/utils/token';
import { updateUser } from '@/service/auth';

export const getAPIVideos = async (_: any, res: Response) => {
  const { access_token, refresh_token, googleID } = res;
  const validToken = await getValidatedToken(access_token!, refresh_token!);
  if (validToken && access_token !== validToken) {
    oauth2Client.setCredentials({ access_token: validToken });
    await updateUser(googleID!, validToken);
  } else {
    oauth2Client.setCredentials({ access_token: access_token });
  }
  setGoogleAuth();
  const youtube = google.youtube('v3');
  const listParams: youtube_v3.Params$Resource$Videos$List = {
    part: ['snippet', 'player', 'statistics'],
    chart: 'mostPopular',
    maxWidth: 1280,
    maxHeight: 714,
    fields:
      'items(id,snippet(channelId,channelTitle,publishedAt,thumbnails(maxres),title),player,statistics(viewCount))',
  };
  const videos = await youtube.videos.list(listParams);
  const items: youtube_v3.Schema$VideoListResponse = videos.data;
  res.json(items);
};
