module.exports = (mongoose) => {
    const reviewSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
        review: { type: String, required: true },
        rating: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },

    });

    const Review = mongoose.model('Review', reviewSchema);
    return {
        Review
    }
};