import { Response } from 'express';
import { YoutubeParams } from '@/types/youtube/index';

declare module 'express-serve-static-core' {
  interface Request {
    googleID?: string;
    email?: string;
  }
  interface Response {
    params: YoutubeParams;
  }
}
