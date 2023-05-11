import { youtube_v3 } from 'googleapis';
import { fromJS } from 'immutable';

export const getChannelID = (item: youtube_v3.Schema$Video) =>
  item.snippet?.channelId;

export const getChannelsID = (items: youtube_v3.Schema$Video[]) => {
  const idsMap = items.map((item) => {
    const id = getChannelID(item);
    return id ? id : '';
  });
  const ids = idsMap.reduce((acc, cur: string) => acc + cur + ',', '');
  return [ids.length ? ids : ''];
};

export const mergeVideoChannel = async (
  videos: youtube_v3.Schema$Video[],
  channels: youtube_v3.Schema$Channel[]
) => {
  const vMap = fromJS(videos);
  const cMap = fromJS(channels);
  return vMap.map((v) =>
    v.setIn(
      ['channel'],
      cMap
        .filter((c) => c.getIn(['id']) === v.getIn(['snippet', 'channelId']))
        .toArray()[0]
    )
  );
};
