import { Response, Request } from 'express';
import { getChannels, getVideos } from '@/service/youtube';
import { getChannelsID, mergeVideoChannel } from '@/utils/items';

export const getVideoItems = async (req: Request, res: Response) => {
  const { params } = req.body;
  const videos = await getVideos(params);
  const id = getChannelsID(videos.items!);
  const channels = await getChannels(id);
  const items = await mergeVideoChannel(videos.items!, channels.items!);
  res.json({ items });
};
