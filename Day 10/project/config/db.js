module.exports = (mongoose,logger) => {
  mongoose.connect(process.env.MONGO_URI).then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('MongoDB connection error:', err.message));
};

