const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String
})

const userModels = mongoose.model('user', userSchema);

module.exports = userModels;


