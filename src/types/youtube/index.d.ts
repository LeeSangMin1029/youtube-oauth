import { youtube_v3 } from 'googleapis';

export type Methods = 'list';
export type VideosListParams = youtube_v3.Params$Resource$Videos$List;
export type ChannelsListParams = youtube_v3.Params$Resource$Channels$List;
export type YoutubeParams = VideosListParams | ChannelsListParams;
export type PlayListsParams = youtube_v3.Params$Resource$Playlists$List;
export type SubscriptionParams = youtube_v3.Params$Resource$Subscriptions$List;
export type CommentsListParams = youtube_v3.Params$Resource$Commentthreads$List;
