const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registerSchema = new mongoose.Schema({
    username:{
        type: String
    },
    password:{
        type: String
    },
    createdAt: {   
        type: Date,
        default: Date.now()
    }
    
});

const loginSchema = new mongoose.Schema({
    username: String,
    password: String,
    token: String,
    lastLoggedIn :{
        type: Date,
        default: Date.now()
    }
})

registerSchema.pre('save',async function ( next ) {
    const salt =await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})



const collection =new mongoose.model('Register', registerSchema);
const loginCollection = new mongoose.model('Login', loginSchema);

module.exports = {collection, loginCollection}