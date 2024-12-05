import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  hashedOtp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("Otp", otpSchema);
