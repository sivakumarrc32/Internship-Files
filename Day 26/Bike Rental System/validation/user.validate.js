const Joi = require('joi');

const signupValidation = Joi.object({
    userName: Joi.string().required(),
    mobile: Joi.string().regex(/^\+91\d{10}$/).messages({
        'string.pattern.base': 'Mobile number must be a starting with +91',
    }),
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(8).required(),
    role: Joi.string().valid('customer', 'agent').required().messages({
        'any.only': 'Role must be either customer or agent',
    }),
})

const loginValidation = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(8).required(),
    role: Joi.string().valid('customer', 'agent').required().messages({
        'any.only': 'Role must be either customer or agent',
    }),
})

const otpValidation = Joi.object({
    email: Joi.string().email(),
    otp: Joi.string().regex(/^\d{6}$/).required(),
})
const resendOtpValidation = Joi.object({
    mobile: Joi.string().regex(/^\+91\d{10}$/).messages({
        'string.pattern.base': 'Mobile number must be a starting with +91',
    })
})

const resetPasswordValidation = Joi.object({
    email: Joi.string().email().required()
})

const passwordValidation = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(8).required(),
    newPassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(8).required(),
})

const adminSignupValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    mobile: Joi.string().regex(/^\+91\d{10}$/).messages({
        'string.pattern.base': 'Mobile number must be a starting with +91',
    }),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(8).required(),
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

module.exports = { signupValidation,loginValidation,otpValidation,resendOtpValidation,resetPasswordValidation,passwordValidation,adminSignupValidation ,validate };