const Joi = require('joi');

const bookingValidation = Joi.object({
    bikeModel: Joi.string().required(),
    bikeBrand: Joi.string().required(),
    planName: Joi.string().valid('Hourly', '7Days', '15Days', '30Days').required(),
    pickupTime: Joi.string().required(),
    dropTime: Joi.string().required(),
    locationId: Joi.string().required(),
    pickupDate: Joi.string().required(),
    dropDate: Joi.string().required(),
    paymentType: Joi.string().required(),
})

const adminVerifyValidation = Joi.object({
    bookingId : Joi.string().required(),
})

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        next();
    };
}

module.exports = { validate, adminVerifyValidation, bookingValidation }