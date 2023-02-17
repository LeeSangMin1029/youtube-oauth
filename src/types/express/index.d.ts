import { UserDocument } from '@/schema';
import { OAuth2Client } from 'google-auth-library';
import { session } from 'express-session';

declare global {
  namespace Express {
    export interface User extends UserDocument {}
    export interface AuthInfo extends OAuth2Client {}
  }
}

declare module 'express-session' {
  export interface SessionData {
    userId?: string;
  }
}
