import { google } from 'googleapis';
import { env } from '@/config';

const { client_id, client_secret, redirect_uri } = env;

export const getOAuth = () =>
  new google.auth.OAuth2(client_id, client_secret, redirect_uri);
