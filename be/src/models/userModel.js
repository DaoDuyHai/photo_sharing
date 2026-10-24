import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
  login_name: { type: String },
  password: { type: String },
});

const User = mongoose.model("Users", userSchema);

export default User;
