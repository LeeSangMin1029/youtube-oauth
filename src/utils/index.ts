import { google } from 'googleapis';
import { env } from '@/config';
import fetch from 'node-fetch';

interface GoogleToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

const { client_id, client_secret, redirect_uri } = env;

export const getOAuth = () =>
  new google.auth.OAuth2(client_id, client_secret, redirect_uri);

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
  const response = await fetch(fetchURL, authInitConfig(token));
  if (response.ok) {
    return await response.json();
  }
  return null;
};

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

export const isEmptyObject = (param: any) =>
  Object.keys(param).length === 0 && param.constructor === Object;
