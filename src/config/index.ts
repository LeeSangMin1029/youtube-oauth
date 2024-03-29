import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const ENV = process.env.NODE_ENV;
if (!(ENV && (ENV === 'development' || ENV === 'test' || ENV === 'production')))
  throw new Error('Unknown NODE_ENV');
const result = dotenv.config({
  path: path.join(__dirname, '../..', ENV + '.env'),
});
if (result.parsed === undefined)
  throw new Error('Cannot loaded environment variables file.');

export const env = {
  http_port: process.env.HTTP_PORT,
  https_port: process.env.HTTPS_PORT,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  token_secret_key: process.env.TOKEN_SECERT_KEY,
  mongodb_secret: process.env.MONGODB_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
  ENV,
};
