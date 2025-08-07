const express = require('express');
const app = express();
const cors = require('cors');


const path = require('path');

const logger = require('./utils/logger');

const mongoose = require('mongoose');``
require('dotenv').config();
const connectDB = require('./config/dataBase');
connectDB(mongoose, logger);

const models = require('./model')(mongoose);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use('/uploads', express.static(path.join(__dirname, "uploads")));

require('./middleware/passport.middleware')(app, models, logger);



module.exports = {app,models,logger};