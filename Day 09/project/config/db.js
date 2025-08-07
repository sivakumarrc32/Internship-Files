const mongoose = require('mongoose');
module.exports = (logger,registerSchema, loginSchema, reportSchema) => {
  mongoose.connect(process.env.MONGO_URI).then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('MongoDB connection error:', err.message));

    return {
        registerSchema,
        loginSchema,
        reportSchema,

    }
};

