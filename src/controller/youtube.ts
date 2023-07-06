import { Response, Request } from 'express';
import {
  getChannelOfPlayLists,
  getChannels,
  getComments,
  getSubscriptionChannelLists,
  getVideos,
  setCommentReply,
  setCommentOfVideo,
} from '@/service/youtube';
import { getChannelsID, mergeVideoChannel } from '@/utils/items';

export const getVideoItems = async (req: Request, res: Response) => {
  const { params } = req.body;
  const videos = await getVideos(params);
  const id = getChannelsID(videos.items!);
  const channels = await getChannels(id);
  const videosInfo = await mergeVideoChannel(videos.items!, channels.items!);
  res.json({
    items: videosInfo,
    nextPageToken: videos.nextPageToken,
    pageInfo: videos.pageInfo,
  });
};

export const getPlayLists = async (_: any, res: Response) => {
  const playLists = await getChannelOfPlayLists();
  res.json({ items: playLists.items });
};

export const getChannelLists = async (_: any, res: Response) => {
  const subscriptions = await getSubscriptionChannelLists();
  res.json({ items: subscriptions.items });
};

export const getCommentsList = async (req: Request, res: Response) => {
  const { params } = req.body;
  const comments = await getComments(params);
  res.json({ items: comments.items });
};

export const createCommentReply = async (req: Request, res: Response) => {
  const { data } = req.body;
  const comment = await setCommentReply(data);
  res.json({ comment });
};

export const createCommentOfVideo = async (req: Request, res: Response) => {
  const { data } = req.body;
  const comment = await setCommentOfVideo(data);
  res.json({ comment });
};
