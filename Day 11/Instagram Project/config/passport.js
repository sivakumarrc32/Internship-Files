const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = (passport, models, logger) => {
    const userService = require('../services/userService')(logger, models);
   const { User } = models;

  passport.use(new FacebookStrategy({
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'emails']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userService.handleFacebookLogin(profile, User, logger);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }

  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
