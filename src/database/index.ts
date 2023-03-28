import mongoose from 'mongoose';
import { env } from '@/config';

export const connectDB = async () => {
  const uri = `mongodb+srv://youtube-user:${env.mongodb_secret}@cluster0.xbwhx.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(uri);
    console.log('connect mongodb database!!! name : youtube-user');
  } catch (err) {
    console.error(err);
  }
};
