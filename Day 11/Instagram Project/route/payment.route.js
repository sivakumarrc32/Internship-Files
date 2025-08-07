module.exports = (logger, models) => {
    const express = require('express');
    const router = express.Router();

    const controller = require('../controller/payment.controller')(logger, models);


    router.get('/choose-plan', (req, res) => {
        const { tempPostId } = req.query;
        res.render('index', { tempPostId }); 
    });
    
    router.get('/create-order', controller.createOrder);
    router.get('/payment-success', controller.captureOrder);

    return router;
    
}