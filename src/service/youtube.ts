import {
  ChannelsListParams,
  VideosListParams,
  PlayListsParams,
  SubscriptionParams,
  CommentsListParams,
} from '@/types/youtube';
import { google } from 'googleapis';

const videoParams: VideosListParams = {
  part: ['snippet', 'player', 'statistics', 'contentDetails'],
  maxWidth: 1268,
  maxHeight: 713,
  regionCode: 'KR',
  fields:
    'nextPageToken,pageInfo,items(id,snippet(channelId,channelTitle,description,publishedAt,thumbnails,title),\
    contentDetails(duration),player,statistics(viewCount,commentCount))',
};

const channelParams: ChannelsListParams = {
  part: ['snippet', 'statistics'],
  fields: 'items(id,snippet(thumbnails),statistics(subscriberCount))',
};

const playListsParams: PlayListsParams = {
  part: ['snippet'],
  mine: true,
  fields: 'items(id,snippet(title))',
};

const subscriptionParams: SubscriptionParams = {
  part: ['snippet', 'contentDetails', 'subscriberSnippet'],
  mine: true,
  fields:
    'items(contentDetails(newItemCount),snippet(title,thumbnails,resourceId(channelId)))',
};

const youtube = google.youtube('v3');

export const getVideos = async (params: Object) => {
  const res = await youtube.videos.list({ ...videoParams, ...params });
  const videos = res.data;
  return videos;
};

export const getChannels = async (id: string[]) => {
  const res = await youtube.channels.list({ ...channelParams, id });
  const channels = res.data;
  return channels;
};

export const getChannelOfPlayLists = async () => {
  const res = await youtube.playlists.list({ ...playListsParams });
  const playLists = res.data;
  return playLists;
};

export const getSubscriptionChannelLists = async () => {
  const res = await youtube.subscriptions.list({ ...subscriptionParams });
  const subChannels = res.data;
  return subChannels;
};

export const getComments = async (params: Object) => {
  const res = await youtube.commentThreads.list({
    part: ['snippet'],
    ...params,
  });
  const comments = res.data;
  return comments;
};

export const setCommentReply = async (data: Object) => {
  const res = await youtube.comments.insert({
    part: ['snippet'],
    requestBody: { snippet: data },
  });
  const comment = res.data;
  return comment;
};

export const setCommentOfVideo = async (data: Object) => {
  const res = await youtube.commentThreads.insert({
    part: ['snippet'],
    requestBody: { snippet: data },
  });
  const comment = res.data;
  return comment;
};
