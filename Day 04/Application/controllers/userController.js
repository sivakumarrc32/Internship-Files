const userModels = require('../model/userModel');
const { userSchema} = require('../validation/validate');


exports.getAllUsers =async (req, res) => {
    const users = await userModels.find({});
    res.json({
        message: "Get all Users",
        data: users});
}

exports.getUserById =async (req, res) => {
    const user = await userModels.where("_id").equals(req.params.id);
    res.json({
        message: "Get Single Users",
        data: user});
}

exports.createUser = async (req, res) => {
    // validate data here if required.
    try {
        const user = await userModels.findOne({email: req.body.email});
        if(user){
            return res.status(400).send('User already exists');
        }
    } catch (error) {
        return res.status(500).send('Error occurred while saving user');
    }
    try{
        const result = await userSchema.validateAsync(req.body);
        console.log(result);
    }catch (error) {
        return res.status(400).send(error.details[0].message);
    }

    const newUser = new userModels({
        name: req.body.name,
        email: req.body.email
    });
    const savedUser = await newUser.save();
    res.json({
        message: "Create Users",
        data: savedUser});
}

exports.updateUser = async (req, res) => {
    try{
        const result = await userSchema.validateAsync(req.body);
        console.log(result);
    }catch (error) {
        return res.status(400).send(error.details[0].message);
    }

    const userUpdate = await userModels.findByIdAndUpdate(req.params.id,req.body,{new: true  });
    res.json({
        message: "Update Users",
        data: userUpdate});
}

exports.deleteUser = async (req, res) => {
    const user = await userModels.where("_id").equals(req.params.id).deleteOne();
    res.json({ 
        message: 'User deleted successfully',
        data: user
     });    
}


