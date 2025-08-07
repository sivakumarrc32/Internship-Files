

module.exports = (logger,models) => {
    const services = require('../services/booking.service')(logger,models);

    const booking = async (req,res) => {
        const bookingData = req.body;
        const { userId } = req.user;
        try{
            const result = await services.Booking(userId,bookingData);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Booking Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const capturePayment = async (req,res) => {
        const { bookingId } = req.query;
        try{
            const result = await services.CapturePayment(bookingId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Capture Payment Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const cancelBooking = async (req,res) => {
        const { bookingId, userId } = req.params;
        try{
            const result = await services.CancelBooking(bookingId, userId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Cancel Booking Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const conformCashPayment = async (req,res) => {
        const { bookingId } = req.body;
        try{
            const result = await services.ConfirmCashPayment(bookingId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Confirm Cash Payment Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const verifyDocument = async (req,res) => {
        const { bookingId } = req.body;
        try{
            const result = await services.VerifyDocument(bookingId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Verify Document Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const returnBike = async (req,res) => {
        const { bookingId } = req.body;
        try{
            const result = await services.ReturnBike(bookingId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Return Bike Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }



    const bookingHistory = async (req,res) => {
        const { userId } = req.user;
        try{
            const result = await services.BookingHistory(userId);
            return res.status(result.status).json(result.data);

        }catch(e){
            logger.error(`Booking History Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    return {
        booking,
        capturePayment,
        conformCashPayment,
        verifyDocument,
        returnBike,
        bookingHistory,
        cancelBooking

    }
}