const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const logger = require('./utils/logger.util');


// Middlewares
const authMiddleware = require('./middlewares/auth.middleware');
const validate = require('./middlewares/validate.middleware');
const multerMiddleware = require('./middlewares/multer.middleware');


// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const reportRoutes = require('./routes/report.routes');



const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use('/api', authRoutes({ logger, validate }));
app.use('/api', userRoutes({ logger, auth: authMiddleware, multer: multerMiddleware }));
app.use('/api/report', reportRoutes({ logger, auth: authMiddleware, validate }));



mongoose.connect(process.env.DB_URI)
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => logger.error('MongoDB connection error:', err));


  
app.listen(process.env.PORT, () => {
  logger.info(`Server running on http://localhost:${process.env.PORT}`);
});
