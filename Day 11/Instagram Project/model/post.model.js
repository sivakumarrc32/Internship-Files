

module.exports =(mongoose) => {
    const postSchema = new mongoose.Schema({
        user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
        caption : String,
        media: [
            {
              url: String,
              type: {
                type: String,
                enum: ['image', 'video'],
              },
            },
          ],
        hashtags: Array,
        likes:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
        }],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    });
    return mongoose.model('Post', postSchema);
}