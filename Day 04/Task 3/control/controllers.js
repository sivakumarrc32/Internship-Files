const {collection,loginCollection} = require('../models/model');
const {registerSchema ,loginSchema} = require('../validate/validation');
const jwt = require('jsonwebtoken');
require('dotenv').config();



//creating token for user
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn: '1h'});

}

exports.userSignUp =async (req, res) => {
    //validate the data for usrname
    
    try{
        await registerSchema.validateAsync(req.body);
    } catch(error){
        return res.status(400).send(error.details[0].message);
    }
     const data ={
         username: req.body.username,
         password: req.body.password
    }

    //check if user already exists
    const existingUser = await collection.findOne({username: data.username});
    if(existingUser){
        return res.status(400).json({
            code : 400,
            message : 'User already exists'});
    }else{
        const userdata =await collection.insertOne(data);

        //JWT token generation
        const token = createToken(userdata._id);
        res.cookie('jwt', token, {httpOnly: true , expires: new Date(Date.now() + 3600000) });
        res.status(200).json({
            code : 200,
            user : userdata._id,
            message: "User registered successfully",
            token
        });
        console.log(userdata);
    }
}

exports.userLogin = async (req, res) => {
    //validate the data for username and password
    try{
        await loginSchema.validateAsync(req.body);
    } catch(error){
        return res.status(400).send(error.details[0].message);
    }

    const data ={
        username: req.body.username,
        password: req.body.password
    }
    //check if user exists
     
}