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
        const userdata =await collection.insertOne(data);
        //JWT token generation
        const token = createToken(userdata._id);
        res.cookie('jwt', token, {httpOnly: true , expires: new Date(Date.now() + 3600000) });
        res.status(200).json({
            code :200,
            user : userdata._id,
            message: "User registered successfully",
            token
        });
        userdata.token = token;
        userdata.save();
        console.log(userdata);
    }
}

exports.userLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await collection.findOne({ username });
        if (!user) {
            return res.status(400).json({ code: 400, message: "User Not Found" });
        }

        const match = await bcrypt.compare(password, user.password);
        console.log("Password Match:", match);

        if (!match) {
            return res.status(400).json({ code: 400, message: "Wrong password" });
        }

        const token = createToken({ id: user._id });
        res.status(200).json({ code: 200, message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Internal Server Error" });
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
        const userId = req.user.id;

        console.log("ek")

        const User= await collection.findById(userId).select("-token");
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
