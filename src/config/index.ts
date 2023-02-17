import dotenv from 'dotenv';
import path from 'path';

(() => {
  const ENV = process.env.NODE_ENV;
  if (!ENV || (ENV !== 'development' && ENV !== 'test' && ENV !== 'production'))
    throw new Error('Unknown NODE_ENV');
  const result = dotenv.config({
    path: path.join(__dirname, '../..', ENV + '.env'),
  });
  if (result.parsed === undefined)
    throw new Error('Cannot loaded environment variables file.');
})();

export const env = {
  port: process.env.PORT,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
};
