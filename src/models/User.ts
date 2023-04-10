import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleID: { type: String, required: true },
  email: String,
  name: String,
  thumbnails: String,
  userURL: String,
  refreshToken: String,
  accessToken: String,
});

const User = mongoose.model('User', userSchema);
export default User;
