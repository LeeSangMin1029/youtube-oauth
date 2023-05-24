import {
  ChannelsListParams,
  ChannelsResponse,
  VideosListParams,
  VideosResponse,
} from '@/types/youtube';
import { google } from 'googleapis';

const videoParams: VideosListParams = {
  part: ['snippet', 'player', 'statistics'],
  maxWidth: 1280,
  maxHeight: 714,
  regionCode: 'KR',
  fields:
    'items(id,snippet(channelId,channelTitle,publishedAt,thumbnails,title),player,statistics(viewCount))',
};

const channelParams: ChannelsListParams = {
  part: ['snippet', 'statistics'],
  fields: 'items(id,snippet(thumbnails),statistics(subscriberCount))',
};

const youtube = google.youtube('v3');

export const getVideos = async (params: Object) => {
  const res = await youtube.videos.list({ ...videoParams, ...params });
  const videos: VideosResponse = res.data;
  return videos;
};

export const getChannels = async (id: string[]) => {
  const res = await youtube.channels.list({ ...channelParams, id });
  const channels: ChannelsResponse = res.data;
  return channels;
};
