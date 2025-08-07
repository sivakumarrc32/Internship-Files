const express = require('express');
const http = require('http');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const swaggerDocs = require('./swagger/swagger.config');

const logger = require('./utils/logger')

const connectDB = require('./config/dataBase');
const models = require('./models')(mongoose);

const time= require('./utils/timeSchedule')(logger, models);
time.holdBooking();
time.overTime();
time.bookingReminders();

const router = require('./route')(logger, models);

connectDB(mongoose, logger);
const app = express();

const server = http.createServer(app);

const socketHandler = require('./middleware/socket.middleware');

socketHandler(server, models, logger);


require('./middleware/passport.middleware')(app, models, logger);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, "uploads")));

app.use('/api', router);
swaggerDocs(app);

server.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});