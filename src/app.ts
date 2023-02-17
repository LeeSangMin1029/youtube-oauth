import 'module-alias/register';
import { env } from '@/config';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRoutes } from '@/routes';
import { headerSetting } from '@/middleware';

const allowedOrigins = ['http://localhost:5173', 'https://accounts.google.com'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

async function bootstrap() {
  const oneDay = 1000 * 60 * 60 * 24;
  const app = express();
  try {
    app.use(helmet());
    app.use(cors(options));
    app.use(morgan('combined'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
      session({
        secret: 'secret key',
        resave: false,
        cookie: { maxAge: oneDay },
        saveUninitialized: false,
      })
    );
    app.use(cookieParser());
    app.use(headerSetting);
    app.use('/api/auth', authRoutes);
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
