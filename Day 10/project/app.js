require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const logger = require('./utils/logger.util');
const validate = require('./utils/validation.util');


const connectDB = require('./config/db');
connectDB(mongoose, logger);


const models =  require('./models')(mongoose);

const schemas = require('./validations');


const authMiddlewareFactory = require('./middlewares/auth.middleware');
const uploadMiddleware = require('./middlewares/upload.middleware');
const authMiddleware = authMiddlewareFactory(models.User);


const authRoutes = require('./routes/auth.routes')(models,logger, validate,schemas,authMiddleware,uploadMiddleware);
const reportRoutes = require('./routes/report.routes')(models,logger, validate, schemas,authMiddleware);

const app = express();

app.use('/profile', express.static(path.join(__dirname, 'public/profile')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api/daily-report', reportRoutes);


const PORT = process.env.PORT || 6262;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));