import { google } from 'googleapis';
import { env } from '@/config';
import fetch from 'node-fetch';
import CryptoJS from 'crypto-js';
import { getErrorMessage } from '@/errors';

interface GoogleToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

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

export const getAPIData = async (
  url: string,
  token: string,
  params?: string
) => {
  let fetchURL = params ? url + params : url;
  let response;
  try {
    response = await fetch(fetchURL, authInitConfig(token));
  } catch (error) {
    console.error(getErrorMessage(error));
  }
  if (response?.ok) {
    return await response.json();
  } else {
    return null;
  }
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

export const reduceChannelID = (items: Int32Array): string => {
  let result = '';
  if (!Array.isArray(items) || items.length === 0) {
    return result;
  }
  result = items.reduce((acc, cur: any) => {
    if (cur && cur.snippet && cur.snippet.channelId) {
      return acc + cur.snippet.channelId + ',';
    }
    return acc;
  }, '');
  return result;
};

export const isEmptyObject = (param: any) =>
  Object.keys(param).length === 0 && param.constructor === Object;
