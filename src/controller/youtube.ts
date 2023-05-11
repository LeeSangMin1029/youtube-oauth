import { Response } from 'express';
import { oauth2Client, setGoogleAuth } from '@/utils/googleauth';
import { getValidatedToken } from '@/utils/token';
import { updateUser } from '@/service/auth';
import { getChannels, getVideos } from '@/service/youtube';
import { getChannelsID, mergeVideoChannel } from '@/utils/items';

export const getAPIVideos = async (_: any, res: Response) => {
  const { access_token, refresh_token, googleID } = res;
  const validToken = await getValidatedToken(access_token, refresh_token);
  if (access_token !== validToken) {
    oauth2Client.setCredentials({ access_token: validToken });
    await updateUser(googleID, validToken);
  } else {
    oauth2Client.setCredentials({ access_token: access_token });
  }
  setGoogleAuth();
  const videos = await getVideos();
  const id = getChannelsID(videos.items!);
  const channels = await getChannels(id);
  const items = await mergeVideoChannel(videos.items!, channels.items!);
  res.json({ items });
};
