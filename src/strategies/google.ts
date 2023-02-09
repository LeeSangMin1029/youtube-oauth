import { PassportStatic } from 'passport';
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { User, SUser } from '@/schema';
import { env } from '@/config';
const { client_id, client_secret, redirect_uri } = env;

type PassportUser = {
  _id?: number;
};

const scopes = [
  'email',
  'profile',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtubepartner',
];

const googleStrategy = (passport: PassportStatic) => {
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: client_id!,
        clientSecret: client_secret!,
        callbackURL: redirect_uri,
        scope: scopes,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          const userDoc: SUser | null = await User.findOne({
            p_id: profile.id,
          });
          if (userDoc) return done(null, userDoc);
          const user = new User({
            p_id: profile.id,
            access_token: accessToken,
            refresh_token: refreshToken,
            name: profile.displayName,
          });
          await user?.save();
          return done(null, user);
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.serializeUser(function (user: PassportUser, done) {
    done(null, user._id);
  });
  passport.deserializeUser(async function (id: string, done) {
    const user = await User.findById(id);
    done(null, user);
  });
};

export default googleStrategy;
