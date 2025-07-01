const Joi = require('joi');

exports.registerSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must be at most 30 characters long',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().min(4).messages({
    'string.min': 'Password must be at least 4 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

exports.loginSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must be at most 30 characters long',
  }),
  password: Joi.string().required().min(4).messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 4 characters long',
  }),
});
