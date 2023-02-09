import 'module-alias/register';
import { env } from '@/config';
import mongoose from 'mongoose';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from '@/routes/auth';
import youtubeRoutes from '@/routes/youtube';
import { googleStrategy } from '@/strategies';

async function bootstrap() {
  const app = express();
  try {
    const uri = `mongodb+srv://youtube-user:${env.db_password}@cluster0.xbwhx.mongodb.net/?retryWrites=true&w=majority`;
    mongoose.set('strictQuery', true);
    mongoose.connect(uri).then(() => {
      console.log('mongoose connected');
    });
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
      session({ secret: 'secret key', resave: false, saveUninitialized: false })
    );
    app.use(passport.initialize());
    app.use(passport.session());
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
