import { Response } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    googleID?: string;
    email?: string;
  }
  interface Response {
    token?: string;
  }
}
