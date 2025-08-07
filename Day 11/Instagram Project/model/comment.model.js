module.exports = (mongoose) => {
    const commentSchema = new mongoose.Schema({
        user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
        comment : String,
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Profile'}],
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        createdAt: {
            type: Date,
            default: Date.now
        },
        reply:[
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
                comment : String,
                likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Profile'}],
                createdAt: {
                    type: Date,
                    default: Date.now
                },
            }
        ]
    })
    return mongoose.model('Comment', commentSchema);
}