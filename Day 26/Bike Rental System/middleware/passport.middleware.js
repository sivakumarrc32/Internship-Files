const session = require('express-session');
const passport = require('passport');

module.exports = (app, models, logger) => {
    app.use(session({
        secret: 'bike-rental-system',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());

    app.use(passport.session());

    require('../config/passport.config')(passport, models, logger);
};