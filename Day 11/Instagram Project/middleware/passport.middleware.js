const session = require('express-session');
const passport = require('passport');

module.exports = (app, models, logger) => {
  app.use(session({
    secret: 'project',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());

  app.use(passport.session());

  require('../config/passport')(passport, models, logger);
};
