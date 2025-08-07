module.exports = (mongoose) => {
  const {Schema} = mongoose;
  const reportSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    userid: String,
    report: String,
    otherNotes: String,
    date: String,
    time: String
  });
  return mongoose.model('Report', reportSchema);
}