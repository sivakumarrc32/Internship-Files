module.exports = (mongoose) => {
  const { Schema } = mongoose;
  const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: String,
    profileImage: String
  });
  return mongoose.model('User', userSchema);
}