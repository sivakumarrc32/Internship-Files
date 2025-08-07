module.exports = (mongoose) => {
    const planSchema = mongoose.Schema({
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        planName: {
            type: String,
            enum:['Free', 'basic', 'pro'],
            default: 'Free',
            required: true
        },
        price: {
            type: Number,
            default: 0,
            required: true
        },
        description : {
            type: String,
            required: true
        },
        planStartDate: {
            type: Date,
            required: true
        },
        planEndDate: {
            type: Date,
            required: true
        }
    });
    return mongoose.model('Plan', planSchema);
}