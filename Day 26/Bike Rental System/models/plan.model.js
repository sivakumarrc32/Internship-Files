module.exports = (mongoose) => {
    const planSchema = new mongoose.Schema({
        planName : {
            type : String,
            enum : ['Hourly', '7Days','15Days','30Days'],
            required : true
        },
        bikeBrand : {
            type : String,
            required : true
        },
        bikeModel : {
            type : String,
            required : true
        },
        charges : {
            type : String,
            required : true
        },
        minHour : String,
        extraCharge : String,
        kmLimit : String,
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location'
        }
    });
    const Plan = mongoose.model('Plan', planSchema);
    return {
        Plan
    }
}
