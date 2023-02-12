import { PassportStatic } from 'passport';
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { User } from '@/schema';
import { env } from '@/config';
const { client_id, client_secret, redirect_uri } = env;

const scopes = [
  'email',
  'profile',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtubepartner',
];

const authOptions = {
  clientID: client_id!,
  clientSecret: client_secret!,
  callbackURL: redirect_uri,
  scope: scopes,
};

const verfiy = async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  const { sub, name, email, email_verified, picture, locale } = profile._json;
  const userDoc = await User.findOne({
    p_id: sub,
  });
  if (userDoc) return done(null, userDoc);
  const user = new User({
    p_id: sub,
    access_token: accessToken,
    refresh_token: refreshToken,
    name: name,
    email,
    email_verified,
    picture,
    locale,
  });
  if (user) {
    await user.save();
    return done(null, user);
  }
  done('Failed to create User');
};

const googleStrategy = (passport: PassportStatic) => {
  passport.use('google', new GoogleStrategy(authOptions, verfiy));
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(async function (id: string, done) {
    const user = await User.findById(id);
    done(null, user);
  });
};

export default googleStrategy;
