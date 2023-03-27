import 'module-alias/register';
import { env } from '@/config';
import fs from 'fs';
import http from 'http';
import https from 'https';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRoutes } from '@/routes';
import { headerSetting } from '@/middleware';

const allowedOrigins = [
  'https://localhost:5173',
  'https://accounts.google.com',
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const SSLOptions = {
  key: fs.readFileSync('./src/localhost-key.pem', 'utf-8'),
  cert: fs.readFileSync('./src/localhost.pem', 'utf-8'),
};

async function bootstrap() {
  const oneDay = 1000 * 60 * 60 * 24;
  const app = express();
  try {
    app.use(helmet());
    app.use(cors(corsOptions));
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
    http.createServer(app).listen(env.http_port, () => {
      console.log(`
      ################################################
      🛡️ http Server listening on port: ${env.http_port}
      ################################################
    `);
    });
    https.createServer(SSLOptions, app).listen(env.https_port, () => {
      console.log(`
      ################################################
      🛡️🛡️ https Server listening on port: ${env.https_port}
      ################################################
    `);
    });
  } catch (err) {
    console.error(err);
  }
}
bootstrap();
