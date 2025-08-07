const Joi = require('joi');
const locationValidation = Joi.object({
    city : Joi.string().required(),
    address : Joi.string().required(),
    mapLink : Joi.string().required()
})

const planValidation = Joi.object({
    planName : Joi.string().required(),
    charges : Joi.string().required(),
    bikeModel : Joi.string().required(),
    bikeBrand : Joi.string().required(),
    city : Joi.string().required(),
    minHour : Joi.string().required(),
    extraCharge : Joi.string().required(),
    kmLimit : Joi.string().required()
})


const reviewValidation = Joi.object({
    bikeId : Joi.string().required(),
    review : Joi.string().required(),
    rating : Joi.number().required(),
})

const editBikeValidation = Joi.object({
    bikeId : Joi.string().required()
}).unknown(true)

const editPlanValidation = Joi.object({
    planId : Joi.string().required()
}).unknown(true)


const editLocationValidation = Joi.object({
    locationId : Joi.string().required(),
    city : Joi.string(),
    address : Joi.string().required(),
    mapLink : Joi.string().required()
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

module.exports = {
    locationValidation,
    planValidation,
    reviewValidation,
    editLocationValidation,
    editBikeValidation,
    editPlanValidation,
    validate
}