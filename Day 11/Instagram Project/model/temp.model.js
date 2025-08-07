module.exports = (mongoose) => {
    const tempPostSchema = new mongoose.Schema({
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
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

    return mongoose.model('TempPost', tempPostSchema);
};
