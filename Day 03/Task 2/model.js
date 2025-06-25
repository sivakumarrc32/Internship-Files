const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

const collection =new mongoose.model('Register', registerSchema);

module.exports = collection;