import { oauth2Client } from './googleauth';
import fetch from 'node-fetch';

type TokenInfo = {
  issued_to: string;
  audience: string;
  user_id: string;
  scope: string;
  expires_in: number;
  email: string;
  verified_email: boolean;
  access_type: string;
};

type BadRequest = {
  error: string;
  error_description: string;
};

type TokenResponse = TokenInfo & BadRequest;

export const getValidatedToken = async (
  checkToken: string,
  refresh_token: string
) => {
  const token = await validateToken(checkToken);
  if (token) {
    return token;
  }
  oauth2Client.setCredentials({ refresh_token });
  const res = await oauth2Client.refreshAccessToken();
  const accessToken = res.credentials.access_token;
  return accessToken ? accessToken : '';
};

export const validateToken = async (checkToken: string) => {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${checkToken}`
  );
  const data = (await res.json()) as TokenResponse;
  if (data.error) {
    return null;
  }
  return checkToken;
};
