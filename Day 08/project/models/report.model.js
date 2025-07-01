const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  username: String,
  reportData: String,
  date: String,
  time: String,
});

module.exports = mongoose.model('Report', reportSchema);
