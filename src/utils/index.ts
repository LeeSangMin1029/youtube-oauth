import { google } from 'googleapis';
import { env } from '@/config';
import fetch from 'node-fetch';
import CryptoJS from 'crypto-js';

interface GoogleToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

const apiType = [
  {
    name: 'youtube',
    url: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
  },
  {
    name: 'google',
    url: `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos`,
  },
];

const { client_id, client_secret, redirect_uri } = env;

export const getOAuth = () =>
  new google.auth.OAuth2(client_id, client_secret, redirect_uri);

export const encryptHMAC = (msg: string) => {
  const keyWA = CryptoJS.enc.Utf8.parse(env.token_secret_key as string);
  const messWA = CryptoJS.enc.Hex.parse(msg);
  const hashedData = CryptoJS.HmacSHA256(messWA, keyWA).toString(
    CryptoJS.enc.Hex
  );
  return hashedData;
};

export const authInitConfig = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAPIData = async (apiName: string, token: string) => {
  const fetchURL = apiType.find((api) => api.name === apiName)?.url;
  const res = await fetch(fetchURL!, authInitConfig(token));
  return await res.json();
};

export const matchedHMAC = (msg: string, hashed: string) =>
  hashed === encryptHMAC(msg);

export const getGrantToken = async (grantToken: string) => {
  const { client_id, client_secret } = env;
  const request = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      refresh_token: grantToken,
      grant_type: 'refresh_token',
    }),
  });
  const { access_token } = (await request.json()) as GoogleToken;
  return access_token;
};
