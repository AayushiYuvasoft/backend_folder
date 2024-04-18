import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  accessToken: {
    type: String,
  },
  userType: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: "user",
  },
});

const user = mongoose.model("user", userSchema);
export default user