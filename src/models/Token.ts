import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  refreshToken: String,
  accessToken: String,
});

const Token = mongoose.model('Tank', tokenSchema);
export default Token;
