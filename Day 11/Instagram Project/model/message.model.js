module.exports = (mongoose) => {
    const messageSchema = new mongoose.Schema({
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
        text: {
          iv : String,
          encrypted : String
        },
        media: [{ type: String }], // file URLs
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      });

      return mongoose.model('Message', messageSchema);
}