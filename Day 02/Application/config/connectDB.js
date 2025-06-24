const mongoose = require('mongoose');
const connectDB =  () => {
    mongoose.connect(process.env.DB_URL)
       .then((con) => console.log('MongoDB Connected to Host :'+con.connection.host))
       .catch((err) => console.log(err));
}


module.exports = connectDB;