import { youtube_v3 } from 'googleapis';

export type Methods = 'list';
export type VideosListParams = youtube_v3.Params$Resource$Videos$List;
export type ChannelsListParams = youtube_v3.Params$Resource$Channels$List;
export type YoutubeParams = VideosListParams | ChannelsListParams;
export type VideosResponse = youtube_v3.Schema$VideoListResponse;
export type ChannelsResponse = youtube_v3.Schema$ChannelListResponse;
export type YoutubeResponse = VideosResponse | ChannelsResponse;
