module.exports = (mongoose) => {
    const bookingSchema = new mongoose.Schema({
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Register',
        },
        bikeModel:{
            type : String,
            required : true
        },
        bikeBrand : {
            type : String,
            required : true
        },
        planName : {
            type : String,
            enum: ['Hourly', '7Days','15Days','30Days'],
            required : true
        },
        pickupTime : {
            type : String,
            default : null, // Optional for plans other than 'Hourly'
        },
        dropTime : {
            type : String,
            default : null, 
        },
        city :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Location',
            required : true
        },
        pickupDate : {
            type : Date,
            required : true
        },
        returnDate : {
            type : Date,
            required : true
        },
        totalAmount : Number,
        paymentMode : {
            type : String,
            enum : ['online', 'cash'],
            required : true
        },
        paymentStatus : {
            type : String,
            enum : ['pending', 'paid', 'refunded']
        },
        rideStatus : {
            type : String,
            enum : ['upcoming','ongoing', 'completed', 'cancelled','overtime']
        },
        paymentId : String,
        captureId : String,
        isCashPaymentConfirmed : Boolean,
        isverified : {
            type : Boolean,
            default : false
        },
        isOverTime : {
            type : Boolean,
            default : false
        },
        pickupReminderSent:{
            type : Boolean,
            default : false
        },
        dropReminderSent : {
            type : Boolean,
            default : false
        },
        bikeReturnDateTime:{
            type : String,
            default : null
        },
        createdAt : {
            type : Date,
            default : Date.now
        },
        updatedAt : {
            type : Date,
            default : Date.now
        }
    });

    const PaymentSchema = new mongoose.Schema({
        userId : { type: mongoose.Schema.Types.ObjectId, ref: 'Register' },
        bookingId : { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        amount : Number,
        paymentStatus : { type: String, enum: ['pending', 'paid'] },
        paymentMode : { type: String, enum: ['online', 'cash'] },
        transactionId : String,
        createdAt : { type: Date, default: Date.now }
    });
    const Payment = mongoose.model('Payment', PaymentSchema);
    const Booking = mongoose.model('Booking', bookingSchema);
    return {
        Booking,
        Payment
    };
}