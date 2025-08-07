require('dotenv').config();
const express = require('express');
const path = require('path');

const logger = require('./utils/logger.util');
const validate = require('./utils/validation.util');
const authMiddleware = require('./middlewares/auth.middleware');
const uploadMiddleware = require('./middlewares/upload.middleware');


const { registerSchema, loginSchema } = require('./validations/auth.validation');
const { reportSchema } = require('./validations/report.validation');

const User = require('./models/user.model');
const Report = require('./models/report.model');

const database = require('./config/db')(logger,registerSchema, loginSchema, reportSchema);

const authRoutes = require('./routes/auth.routes')(User,logger, validate,database,authMiddleware(User),uploadMiddleware);
const reportRoutes = require('./routes/report.routes')(Report,User,logger, validate, database,authMiddleware(User));

const app = express();

app.use('/profile', express.static(path.join(__dirname, 'public/profile')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api/daily-report', reportRoutes);


const PORT = process.env.PORT || 6262;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));