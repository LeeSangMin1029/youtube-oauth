export const allVideos =
  'videos?part=snippet,player,statistics&chart=mostPopular&maxWidth=1280&maxHeight=714&fields=items(id,snippet(channelId,channelTitle,publishedAt,thumbnails(maxres),title),player,statistics(viewCount))';
export const oneChannels =
  'channels?part=snippet&fields=items(id,snippet(thumbnails(default)))';
export const mineChannels = 'channels?part=snippet&mine=true';
export const youtubeURL = 'https://www.googleapis.com/youtube/v3/';
