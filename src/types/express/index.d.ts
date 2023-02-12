import { UserDocument } from '@/schema';
import { OAuth2Client } from 'google-auth-library';

declare global {
  namespace Express {
    export interface User extends UserDocument {}
    export interface AuthInfo extends OAuth2Client {}
  }
}
