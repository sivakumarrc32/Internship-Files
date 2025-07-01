const Joi = require('@hapi/joi');

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'any.required': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot be more than 30 characters long'
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'Password is required',
        'string.min': 'Password must be at least 6 characters long'
    })
})

const loginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'any.required': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot be more than 30 characters long'
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'Password is required',
        'string.min': 'Password must be at least 6 characters long'
    })
})

module.exports = {registerSchema , loginSchema};