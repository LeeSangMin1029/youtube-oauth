import passport from 'passport';

export const passAuthAccess = passport.authenticate('google', {
  accessType: 'offline',
});

export const passAuthRedirect = passport.authenticate('google', {
  failureRedirect: '/',
  successRedirect: '/api/youtube',
});
