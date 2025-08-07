module.exports = (mongoose) => {
    const bikeSchema = new mongoose.Schema({
        agentId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        bikeModel : String,
        bikeBrand : String,
        bikeImage : String,
        bikeNumber : String,
        city : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Location'
        },
        isAvailable : Boolean,
        plans :[{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Plan'
        }],
        createdAt : {
            type : Date,
            default : Date.now
        },
        updatedAt : {
            type : Date,
            default : Date.now
        }
    });

    const agentBikeSchema = new mongoose.Schema({
        agentId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Register',
            required : true
        },
        modelName: {
            type: String,
            required: true
          },
        brandName: {
            type: String,
            required: true
        },
        cc: {
            type: String,
            required: true
        },
        mileage: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        fuelType: {
            type: String,
            enum: ['Petrol', 'Electric', 'Diesel'],
            default: 'Petrol'
        },
        bikeType: {
            type: String,
            enum: ['Gear', 'Scooty'],
            default: 'Gear'
        },
        bikeNumber : {
            type: String,
            required: true
        },
        engineDetails: {
            type: String
        },
        bikeImage: {
            type: String 
        },
        city : {
            type : String,
            enum : ['chennai',"madurai","coimbatore"],
            required : true
        },
        isApproved : {
            type : String,
            enum : ['pending', 'approved', 'rejected'],
            default : 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
        
        
    });


    const Bike = mongoose.model('Bike', bikeSchema);
    const AgentBike = mongoose.model('AgentBike', agentBikeSchema);
    return {
        Bike,
        AgentBike
    };
}