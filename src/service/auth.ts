import { Credentials } from 'google-auth-library';
import { google, youtube_v3, people_v1 } from 'googleapis';
import User from '@/models/User';

// 아래의 함수들은 나중에 수정

type UserData = {
  name: string | null | undefined;
  email: string | null | undefined;
  googleID: string | undefined;
  thumbnails: string | null | undefined;
  userURL: string | null | undefined;
};

type UpdateUserOptions = {
  accessToken?: string;
  refreshToken?: string;
  email?: string;
};

export const getYoutubeUser = async () => {
  const service = google.youtube('v3');
  const listParams: youtube_v3.Params$Resource$Channels$List = {
    part: ['snippet'],
    mine: true,
  };
  const res = await service.channels.list(listParams);
  const data: youtube_v3.Schema$ChannelListResponse = res.data;
  const snippet = data.items![0].snippet;
  const thumbnails = snippet?.thumbnails?.default?.url;
  const userURL = snippet?.customUrl;
  return { thumbnails, userURL };
};

export const getGoogleUser = async () => {
  const service = google.people('v1');
  const listParams: people_v1.Params$Resource$People$Get = {
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,photos',
  };
  const res = await service.people.get(listParams);
  const data: people_v1.Schema$Person = res.data;
  const name = data.names![0].displayName;
  const email = data.emailAddresses![0].value;
  const googleID = data.resourceName?.split('/')[1];
  return { name, email, googleID };
};

export const getAPIProfile = async () => {
  const [profile1, profile2] = await Promise.all([
    getYoutubeUser(),
    getGoogleUser(),
  ]);
  return { ...profile1, ...profile2 };
};

export const createUser = async (tokens: Credentials, profile: UserData) => {
  const { access_token, refresh_token } = tokens;
  const { googleID, email, name, thumbnails, userURL } = profile;
  User.create({
    googleID,
    email,
    name,
    thumbnails,
    userURL,
    accessToken: access_token,
    refreshToken: refresh_token,
  });
};

export const findUser = async (googleID: string) =>
  await User.findOne({ googleID });

export const updateUser = async (
  googleID: string,
  options: UpdateUserOptions
) => {
  await User.findOneAndUpdate({ googleID }, { ...options }, { new: true });
};
