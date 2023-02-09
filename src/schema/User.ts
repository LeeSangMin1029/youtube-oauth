import { Schema, model } from 'mongoose';

export interface SUser {
  p_id: string;
  name: string;
  access_token: string;
  refresh_token: string;
}

const userSchema = new Schema<SUser>({
  p_id: { type: String, unique: true },
  name: String,
  access_token: String,
  refresh_token: String,
});

export const User = model('User', userSchema);
