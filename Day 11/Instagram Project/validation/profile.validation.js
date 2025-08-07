const Joi = require('joi');

const profileValidation = Joi.object({
    name: Joi.string().min(3).max(50),

    userName: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9_]{3,20}$/)),

    bio: Joi.string().max(160),

    email: Joi.string().email(),

    accountType: Joi.string().valid('Private', 'Public').default('Public'),

    links: Joi.string(),

    gender: Joi.string().valid('Male', 'Female', 'Other').default('Other'),

    DOB: Joi.date(),

    profilePic: Joi.object().optional(),

    follower: Joi.object().pattern(Joi.string(), Joi.object({
        userId: Joi.string().required()
    })).default({}),

    following: Joi.object().pattern(Joi.string(), Joi.object({
        userId: Joi.string().required()
    })).default({}),

    request: Joi.array().items(Joi.string()).default([])
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
module.exports = { profileValidation, validate };