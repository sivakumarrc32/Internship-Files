

module.exports = (logger, models) => {
    const express = require('express');
    const router = express.Router();
    const passport = require('passport');
    const authController = require('../controllers/user.controller')(logger, models);
    const {signupValidation, loginValidation,otpValidation,resendOtpValidation,resetPasswordValidation,passwordValidation , validate} = require('../validation/user.validate')
    const auth = require('../middleware/user.middleware')(models);

    //Customer and Agent Signup
    router.post('/user-signup',validate(signupValidation),authController.userSignup);
    // router.post('/agent-signup',validate(signupValidation),authController.agentSignup);

    //Customer and Agent Login
    router.post('/user-login',validate(loginValidation),authController.userLogin);
    // router.post('/agent-login',validate(loginValidation),authController.agentLogin);


    // Common for all users
    router.post('/verify',validate(otpValidation),authController.userVerify);
    router.post('/resend-otp',validate(resendOtpValidation),authController.reSendOtp);
    router.post('/forgot-password',validate(resetPasswordValidation),authController.forgotPassword);
    router.post('/change-password',validate(passwordValidation),authController.changePassword);
    router.get('/profile',auth,authController.userProfile);
    router.patch('/profile-edit',auth,authController.userEditProfile);

    //Logout
    router.post('/logout',auth,authController.userLogout);


    //Google Route
    router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
    router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login'}),authController.googleCallBack);

    return router;
}