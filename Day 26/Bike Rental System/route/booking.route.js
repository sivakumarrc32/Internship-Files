module.exports = (logger,models) => {
    const router = require('express').Router();
    const {bookingValidation, adminVerifyValidation, validate} = require('../validation/booking.validation');
    const controller = require('../controllers/booking.controller')(logger,models);
    const auth = require('../middleware/user.middleware')(models);
    const adminAuth = require('../middleware/admin.niddleware')(models);

    router.post('/book-bike', auth,validate(bookingValidation),controller.booking);
    router.get('/payment-success',controller.capturePayment);
    router.post('/admin/conform-cash',adminAuth,validate(adminVerifyValidation),controller.conformCashPayment);
    router.post('/admin/verify-documents',adminAuth,validate(adminVerifyValidation),controller.verifyDocument);

    router.post('/admin/return-bike',adminAuth,validate(adminVerifyValidation),controller.returnBike);
    router.get('/booking-history',auth,controller.bookingHistory);

    router.get('/cancel-ride/:bookingId/:userId',controller.cancelBooking);

    return router;
}