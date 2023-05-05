import { Response } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    googleID?: string;
    email?: string;
  }
  interface Response {
    access_token?: string;
    refresh_token?: string;
    googleID?: string;
  }
}
