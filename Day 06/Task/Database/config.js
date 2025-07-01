const mongoose = require('mongoose');
const connect = () => {
    mongoose.connect('mongodb://localhost:27017/newdatabase').then(() => console.log('MongoDB Connected...')).catch(()=> console.log('Connection Failed!'));
}

module.exports = connect;