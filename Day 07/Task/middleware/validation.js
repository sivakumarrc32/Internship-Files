const {registerSchema, loginSchema} = require('../validation/validate.js')
const {collection} = require('../model/model.js')

exports.userSignUpvalidate =async (req , res , next) =>{
    try{
        await registerSchema.validateAsync(req.body);
        
    }catch(e){
        return res.status(400).json({
            code : 400,
            message : e.details[0].message, 
        })
    }
    next()
}

exports.userLoginvalidate =async (req , res, next) =>{

    try{
        await loginSchema.validateAsync(req.body);
    } catch(e){
        return res.status(400).json({
            code : 400,
            message : e.details[0].message});
    }

    next();
}

