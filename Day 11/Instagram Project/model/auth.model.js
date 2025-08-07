
module.exports = (mongoose) => {

    const authSchema = new mongoose.Schema({
        mobileNo:{
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        password:{
            type: String,
            required: false
        },
        fullName:{
            type: String,
            required: true
        },
        userName:{
            type: String,
            required: false,
            unique:true
        },
        facebookId: {
            type: String,
            required: false,
        },
        loginProvider: {
            type: String,
            enum: ['local', 'facebook'],
            default: 'local',
        },
        otp: {
            type: String,
        },
        otpExpiry: {
            type: Date,
        },
        isVerified:{
            type: Boolean,
            default: false
        },
        createdAt:{
            type:Date,
            default: Date.now
        },
        updateAt:{
            type: Date,
            default: Date.now
        }
    })
    return mongoose.model('User', authSchema);
}
