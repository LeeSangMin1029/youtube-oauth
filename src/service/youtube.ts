import { google, youtube_v3 } from 'googleapis';

export const getVideos = async () => {
  const youtube = google.youtube('v3');
  const params: youtube_v3.Params$Resource$Videos$List = {
    part: ['snippet', 'player', 'statistics'],
    chart: 'mostPopular',
    maxWidth: 1280,
    maxHeight: 714,
    maxResults: 10,
    fields:
      'items(id,snippet(channelId,channelTitle,publishedAt,thumbnails,title),player,statistics(viewCount))',
  };
  const res = await youtube.videos.list(params);
  const videos: youtube_v3.Schema$VideoListResponse = res.data;
  return videos;
};

export const getChannels = async (id: string[]) => {
  const youtube = google.youtube('v3');
  const params: youtube_v3.Params$Resource$Channels$List = {
    part: ['snippet'],
    id,
    fields: 'items(id,snippet(thumbnails))',
  };
  const res = await youtube.channels.list(params);
  const channels: youtube_v3.Schema$ChannelListResponse = res.data;
  return channels;
};
