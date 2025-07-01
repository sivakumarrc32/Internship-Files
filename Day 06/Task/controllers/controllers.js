const {collection,loginCollection} = require('../model/model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt')



//creating token for user
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn: '60d'});

}

exports.userSignUp =async (req, res) => {
    const data = {
        username : req.body.username,
        password: req.body.password
    }

    //check if user already exists
    const existingUser = await collection.findOne({username: data.username});
    if(existingUser){
        return res.status(400).json({
            code : 400,
            message : 'User already exists'});
    }else{
        const newUser = new collection(data);
        await newUser.save();
        
        res.status(200).json({
            code :200,
            user : newUser._id,
            message: "User registered successfully",
        });
        console.log(newUser);
    }
}

exports.userLogin = async (req, res) => {
    const data = {
        username : req.body.username,
        password : req.body.password
    }

    try {
        const user = await collection.findOne({ username : data.username});

        if (!user) {
            return res.status(400).json({ code: 400, message: "User Not Found" });
        }

        console.log("User found in DB:", user);
        console.log("Password entered by user:", data.password);
        console.log("Hashed password from DB:", user.password);

        const match =await bcrypt.compare(data.password,user.password)
        console.log("Password Match:", match);

        if (!match) {
            return res.status(400).json({ code: 400, message: "Wrong password" });
        }

        const token = createToken({ id: user._id });
        const logindata =await loginCollection.create({
            username : data.username,
            token: token
        });
        res.status(200).json({ 
            code: 200, 
            message: "Login successful", 
            data : logindata 
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ code: 400, message: "Login Unsuccessful" });
    }
};

exports.getAllUser = async (req, res) =>
{
    try{
        const Users = await collection.find({});
        res.status(200).json({
            code :200,
            message : "Get All Registered Users",
            Data : Users
        })
    }catch{
        return res.status(400).json({
            code : 400,
            message : "cannot get all users"
        })

    }
}

exports.getSingleUser = async (req, res) =>
{
    console.log('heko');

    try{
        const userName = req.body.username;

        console.log("ek")

        const User= await collection.find({username : userName}).select("-token");
        console.log(User)
        if(!User ){
            return res.status(400).json({
                code : 400,
                message : "User Not Found"
            })
        }

        res.status(200).json({
            code: 200,
            message : "Single USer",
            Data : User
        })

    }catch{
        return res.status(400).json({
            code : 400,
            message :"Cannot Get Single User"
        })

    }
}
