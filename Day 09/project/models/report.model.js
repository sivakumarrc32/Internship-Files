const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  userid: String,
  report: String,
  otherNotes: String,
  date: String,
  time: String
});
module.exports = mongoose.model('Report', reportSchema);