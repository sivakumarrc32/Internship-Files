const mongoose = require('mongoose');
const logger = require('../logger/logs')


const connect = () => {
    mongoose.connect('mongodb://localhost:27017/newdatabase')
        .then(() => logger.info('MongoDB Connected...'))
        .catch(()=> logger.error('Connection Failed!'));
}

module.exports = connect;