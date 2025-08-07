const Joi = require('joi');

const reportSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required'
  }),
  userid: Joi.string().required().messages({
    'string.base': 'UserId must be a string',
    'string.empty': 'UserId cannot be empty',
    'any.required': 'UserId is required'
  }),
  date: Joi.string().required().messages({
    'string.base': 'Date must be a string',
    'string.empty': 'Date cannot be empty',
    'any.required': 'Date is required'
  }),
  report: Joi.string().required().messages({
    'string.base': 'Report must be a string',
    'string.empty': 'Report cannot be empty',
    'any.required': 'Report is required'
  }),
  otherNotes: Joi.string().optional().messages({
    'string.base': 'Other notes must be a string',
    'string.empty': 'Other notes cannot be empty'
  }),
  confirmSubmit: Joi.boolean().valid(true).required().messages({
    'boolean.base': 'Confirm submission must be a boolean',
    'any.only': 'You must confirm submission to proceed',
    'any.required': 'Confirm submission is required'
  })
});

module.exports = { reportSchema };