import express from 'express';
import { register, login, verifyOTP, resendOtp, forgetPassword,verifyForgetPassword, resetPassword} from '../controller/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/verify-otp', verifyOTP);
authRoutes.post('/resend-otp', resendOtp);
authRoutes.post('/forget-password', forgetPassword);
authRoutes.post('/verify-forget-password', verifyForgetPassword);
authRoutes.post('/reset-password', resetPassword);



export default authRoutes;