const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must not exceed 30 characters',
        'string.empty': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required'
    })
})

module.exports = { userSchema };