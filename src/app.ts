import moduleAlias from 'module-alias';
moduleAlias.addAliases({
  '@': `${__dirname}`,
});
import { env } from '@/config';
import { connectDB } from '@/database';
import fs from 'fs';
import http from 'http';
import https from 'https';
import cors from 'cors';
import { createHttpTerminator } from 'http-terminator';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRoutes, youtubeRoutes } from '@/routes';
import {
  errorHandlerWithResponse,
  headerSetting,
  loggerHandler,
  shouldCompress,
} from '@/middleware';
import './process';

const allowedOrigins = [
  'https://localhost:5173',
  'https://accounts.google.com',
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const app = express();
export const server = http.createServer(app);
export const httpTerminator = createHttpTerminator({
  server,
});

const oneDay = 1000 * 60 * 60 * 24;
const expressSession: session.SessionOptions = {
  secret: 'secret key',
  resave: false,
  cookie: { maxAge: oneDay },
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://youtube-user:${env.mongodb_secret}@cluster0.xbwhx.mongodb.net/?retryWrites=true&w=majority`,
  }),
};

let SSLRoute = 'src';
if (app.get('env') === 'production') {
  SSLRoute = 'bin';
  app.set('trust proxy', 1);
  if (expressSession.cookie !== undefined) expressSession.cookie.secure = true;
}

const SSLOptions = {
  key: fs.readFileSync(`./${SSLRoute}/localhost-key.pem`, 'utf-8'),
  cert: fs.readFileSync(`./${SSLRoute}/localhost.pem`, 'utf-8'),
};

async function bootstrap() {
  await connectDB();
  app.use(compression({ filter: shouldCompress }));
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(morgan('combined'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(session(expressSession));
  app.use(cookieParser());
  app.use(headerSetting);
  app.use('/api/auth', authRoutes);
  app.use('/api/youtube', youtubeRoutes);
  app.use(loggerHandler);
  app.use(errorHandlerWithResponse);
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
}
bootstrap();
