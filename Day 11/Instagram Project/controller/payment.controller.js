module.exports = (logger, models) => {
    const {Order,TempPost} = models;
    const services = require('../services/payment.service')(logger, models);

    const createOrder = async (req, res) => {
        const { plan, tempPostId } = req.query;
      
        const result = await services.createOrder( plan, tempPostId, models);

        const order = await Order.create({
            orderId: result.data.orderId,
            planType: plan,
            tempPost: tempPostId,
            user: tempPostId.user,
            status: 'CREATED'
        })
        return res.redirect(result.data.redirect);
      };
      
      const captureOrder = async (req, res) => {
        const { token, tempPostId } = req.query;
      
        const result = await services.capturePayment(token,tempPostId);
        const { success, message } = result;
        return res.render('payment-status', { success, message });
      };
      

    return {
        createOrder,
        captureOrder
    }
}