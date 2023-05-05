import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleID: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  thumbnails: { type: String, required: true },
  userURL: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
export default User;
