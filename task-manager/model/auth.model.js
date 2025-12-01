import { verify } from 'crypto';
import mongoose from 'mongoose';
const authSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyOTP: { type: String },                    
    otpExpiry: { type: Date },                 
    isVerified: { type: Boolean, default: false },
    forgetPasswordOTP: { type: String }, 
    forgetPasswordOtpExpiry: { type: Date }, 

});
const Auth = mongoose.model('Auth', authSchema);
export default Auth;