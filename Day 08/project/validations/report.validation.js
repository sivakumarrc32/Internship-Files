const Joi = require('joi');

exports.reportSchema = Joi.object({
  reportData: Joi.string().required().messages({
    'string.empty': 'Report data is required',
    'any.required': 'Report data is required',
  })
});
