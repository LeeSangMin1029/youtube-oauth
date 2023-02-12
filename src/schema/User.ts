import { Schema, model, Document } from 'mongoose';

export type UserDocument = Document & {
  p_id: string;
  name: string;
  access_token: string;
  refresh_token: string;
  email: string;
  email_verified: string;
  picture: string;
  locale: string;
};

const userSchema = new Schema<UserDocument>(
  {
    p_id: { type: String, unique: true },
    name: String,
    access_token: String,
    refresh_token: String,
    email: String,
    email_verified: String,
    picture: String,
    locale: String,
  },
  { collection: 'youtube-user' }
);

export const User = model<UserDocument>('User', userSchema);
