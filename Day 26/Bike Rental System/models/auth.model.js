

module.exports = (mongoose) => {
    const registerSchema = new mongoose.Schema({
        userName : String,
        email : {
            type: String,
            required: true
        },
        mobile : {
            type: String,
        },
        password : String,
        role:{
            type: String,
            enum: ['customer', 'agent', 'admin', 'superadmin'],
        },
        address: String,
        city:   String,
        loginProvider:{
            type: String,
            enum: ['local', 'google'],
            default: 'local'
        },
        isVerified : {
            type: Boolean,
            default: false
        },
        googleId:{
            type: String,
            unique: true,
            sparse: true
        },
        otp: String,
        otpExpire: Date,
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    })

   
    const User = mongoose.model('Register', registerSchema);
    return {User};
}