module.exports = (mongoose,logger) => {
    mongoose.connect(process.env.DB_URL).then(()=>{
        logger.info('MongoDB connected successfully');
    }).catch((err) => {
        logger.error('MongoDB connection error:', err.message);
    });
}