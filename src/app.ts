import 'module-alias/register';
import { env } from '@/config';
import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { authRoutes, youtubeRoutes } from '@/routes';
import { googleStrategy } from '@/strategies';
import { headerSetting } from '@/middleware';

const allowedOrigins = ['http://localhost:5173', 'https://accounts.google.com'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

async function bootstrap() {
  const app = express();
  try {
    const uri = `mongodb+srv://youtube-user:${env.db_password}@cluster0.xbwhx.mongodb.net/?retryWrites=true&w=majority`;
    mongoose.set('strictQuery', true);
    mongoose.connect(uri).then(() => {
      console.log('mongoose connected');
    });
    app.use(cors(options));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
      session({ secret: 'secret key', resave: false, saveUninitialized: false })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(headerSetting);
    googleStrategy(passport);
    app.use('/api/auth', authRoutes);
    app.use('/api/youtube', youtubeRoutes);
    app.listen(env.port, () => {
      console.log(`
      ################################################
      🛡️  Server listening on port: ${env.port}
      ################################################
    `);
    });
  } catch (err) {
    console.error(err);
  }
}
bootstrap();
