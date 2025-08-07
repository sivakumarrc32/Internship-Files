const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports =(passport, models, logger) => {
    
    const { User } = models;
    const services = require('../services/user.service')(logger, models);   


    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/user/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }
          const user = await services.handleGoogleLogin(profile, models, logger);
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
}