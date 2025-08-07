const Joi = require('joi');

const adminSignupValidation = Joi.object({
    superAdminId: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email(),
    mobile: Joi.string().regex(/^\d{10}$/),
    secretCode: Joi.string().required(),
    role: Joi.string().valid('admin').required(),
    isVerified: Joi.boolean().required()
})


const adminLoginValidation = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(8).required(),
    secretCode: Joi.string().required()
})

const passwordValidation = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(8).required(),
    newPassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(8).required(),
    secretCode: Joi.string().required()
})


const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        next();
    };
};

module.exports = {
    adminSignupValidation,
    passwordValidation,
    adminLoginValidation,
    validate
};