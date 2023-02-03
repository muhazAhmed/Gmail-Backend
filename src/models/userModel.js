const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number },
    recoveryEmail: { type: String },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
