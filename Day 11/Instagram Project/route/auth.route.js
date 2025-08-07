
module.exports = (logger,models) => {
  const express = require('express');
  const passport = require('passport');
    const router = express.Router();
    const controller = require('../controller/auth.controller')(logger, models);
    const {signupValidation, loginValidation, validate} = require('../validation/auth.validation')

    router.post('/signup',validate(signupValidation), controller.signup);
    router.post('/verify',controller.otpverify);
    router.post('/resendOtp',controller.reSendOtp);
    router.post('/login',validate(loginValidation), controller.login);

    router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
    router.get('/facebook/callback',
      passport.authenticate('facebook', { session: false, failureRedirect: '/login', successRedirect: '/facebook/complete' }),
      controller.facebookCallback
    );

    router.post('/facebook/complete',validate(signupValidation),controller.facebookComplete);
    return router;
};