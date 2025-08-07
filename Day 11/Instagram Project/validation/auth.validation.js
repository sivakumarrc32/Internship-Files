const Joi = require('joi');

const signupValidation = Joi.object({
    mobileNo: Joi.string().regex(/^\d{10}$/),
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(6).required().custom((values,helper)=> {
        const fullName = helper?.state?.ancestors[0]?.fullName;
        if(fullName === values) {
            return helper.message('Password cannot be the same as full name');
        }
        if(values === "123456789" || values === "1234567890"){
            return helper.message("Password is to Easy,Change the Password")
        }
        return values;
    }),
    fullName: Joi.string().min(3).max(50).required(),
    userName: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9_]{3,20}$/)).required()
}).or('mobileNo', 'email').messages({
    'object.missing': 'At least one of mobileNo or email is required'
});

const loginValidation = Joi.object({
    mobileNo: Joi.string().regex(/^\d{10}$/),
    email: Joi.string().email().messages({
        'string.email': 'Email must be a valid email address',
    }),
    userName: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9_]{3,20}$/)),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).min(6).required()
}).or('mobileNo','email','userName').messages({
    'object.missing': 'At least one of mobileNo, email, or userName is required'
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

module.exports = {signupValidation ,loginValidation, validate}
    