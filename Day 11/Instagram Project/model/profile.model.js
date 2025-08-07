
module.exports = (mongoose) => {

    if (mongoose.models.Profile) {
        return mongoose.models.Profile;
      }
    

    const profileSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name : String,
        userName : String,
        bio :String,
        email: String,
        accountType: {
            type: String,
            enum: ['Private', 'Public'],
            default: 'Public'
        },
        links:String,
        gender:{
            type: String,
            enum: ['Male', 'Female','Other'],
            default: 'Other',
            select: false
        },
        DOB:{
            type:Date,
            select: false
        },
        profilePic : Object,
        follower: {
            type: Map,
            of:{
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
            },
            _id : false,
            default: {}
        },
        following: {
            type: Map,
            of:{
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
            },
            _id : false,
            default: {}
        },
        request:[{
            type: mongoose.Schema.Types.ObjectId, ref: 'Profile',
            select: false
        }
        ],
        planName:{
            type: String,
            enum:['Free', 'basic', 'pro'],
            default: 'Free',
            select: false
        },
        planStartDate: {
            type: Date,
            select: false
        },
        planEndDate: {
            type: Date,
            select: false
        }
    });
    return mongoose.model('Profile', profileSchema);
}