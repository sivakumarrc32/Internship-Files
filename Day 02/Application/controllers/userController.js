const userModels = require('../model/userModel');
exports.getAllUsers =async (req, res) => {
    const users = await userModels.find({});
    res.json({
        message: "Get all Users",
        data: users});
}

exports.getUserById =async (req, res) => {
    const user = await userModels.findById(req.params.id);
    res.json({
        message: "Get Single Users",
        data: user});
}

exports.createUser = async (req, res) => {
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
    const userUpdate = await userModels.findByIdAndUpdate(req.params.id,req.body,{new: true  });
    res.json({
        message: "Update Users",
        data: userUpdate});
}

exports.deleteUser = async (req, res) => {
    const user = await userModels.findByIdAndDelete(req.params.id);
    res.json({ 
        message: 'User deleted successfully',
        data: user
     });    
}


