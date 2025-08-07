module.exports = (mongoose) => {
    const sessionSchema = new mongoose.Schema({
        userId : { type: mongoose.Schema.Types.ObjectId, ref: 'Register' },
        role : {
            type: String,
            enum: ['customer', 'admin', 'agent']
        },
        activeStatus : Boolean,
        lastActive : Date,
    })

    const Session = mongoose.model('Session', sessionSchema);


    return {
        Session
    }
}