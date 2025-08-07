module.exports = (logger, models) => {
    const express = require('express');
    const router = express.Router();
    const adminController = require('../controllers/admin.controller')(logger, models);
    const {adminSignupValidation,passwordValidation,adminLoginValidation ,validate} = require('../validation/admin.validate')
    const admin = require('../middleware/admin.niddleware')(models);

    //Admin Routes
    router.post('/create',validate(adminSignupValidation),adminController.createAdmin);
    router.post('/login',validate(adminLoginValidation),adminController.adminLogin);
    router.post('/change-password',validate(passwordValidation),admin,adminController.changePassword);
    router.post('/logout',admin,adminController.adminLogout);


    router.get('/all-users',admin,adminController.getAllUsers);
    router.get('/all-bikes',admin,adminController.getAllBikes);
    router.get('/all-reviews',admin,adminController.getAllReviews);
    router.get('/all-plans',admin,adminController.getAllPlans);


    return router;
};