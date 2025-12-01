import Auth from '../model/auth.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';
import nodemailer from 'nodemailer';

// ✅ Function to send OTP email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_FROM || '"Task Manager" <no-reply@taskmanager.com>',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
        html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP ${otp} sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

// ✅ REGISTER USER
const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await Auth.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = bcrypt.hashSync(password, 8);
        const otpNumber = randomstring.generate({ length: 6, charset: 'numeric' });
        const encryptedOTP = bcrypt.hashSync(otpNumber, 8);

        const newUser = new Auth({
            username,
            email,
            password: hashedPassword,
            verifyOTP: encryptedOTP,
            otpExpiry: Date.now() + 5 * 60 * 1000,
            isVerified: false,
        });

        const user = await newUser.save();
        await sendOtpEmail(user.email, otpNumber);

        res.status(201).json({
            message: 'User registered successfully. Verify your email using OTP.',
            user: { id: user._id, username: user.username, email: user.email, isVerified: false },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// ✅ VERIFY OTP (Email Verification)
const verifyOTP = async (req, res) => {
    const { email, verifyOTP } = req.body;
    if (!email || !verifyOTP) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

        if (Date.now() > user.otpExpiry) {
            user.verifyOTP = null;
            user.otpExpiry = null;
            await user.save();
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        const isOtpValid = bcrypt.compareSync(verifyOTP, user.verifyOTP);
        if (!isOtpValid) return res.status(401).json({ message: 'Invalid OTP' });

        user.isVerified = true;
        user.verifyOTP = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};

// ✅ LOGIN USER
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    try {
        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email before login' });

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// ✅ RESEND OTP
const resendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

        const otpNumber = randomstring.generate({ length: 6, charset: 'numeric' });
        user.verifyOTP = bcrypt.hashSync(otpNumber, 8);
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOtpEmail(email, otpNumber);

        res.status(200).json({ message: 'New OTP sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resending OTP', error });
    }
};

// ✅ FORGOT PASSWORD - Send OTP
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otpNumber = randomstring.generate({ length: 6, charset: 'numeric' });
        user.forgetPasswordOTP = bcrypt.hashSync(otpNumber, 8);
        user.forgetPasswordOtpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOtpEmail(email, otpNumber);

        res.status(200).json({ message: 'Password reset OTP sent to your email.' });
    } catch (error) {
        console.error('Error in forgetPassword:', error);
        res.status(500).json({ message: 'Error generating OTP', error });
    }
};

// ✅ VERIFY FORGOT PASSWORD OTP
const verifyForgetPassword = async (req, res) => {
    const { email, verifyOTP } = req.body;
    if (!email || !verifyOTP) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (Date.now() > user.forgetPasswordOtpExpiry) {
            user.forgetPasswordOTP = null;
            user.forgetPasswordOtpExpiry = null;
            await user.save();
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        const isOtpValid = bcrypt.compareSync(verifyOTP, user.forgetPasswordOTP);
        if (!isOtpValid) return res.status(401).json({ message: 'Invalid OTP' });

        user.forgetPasswordOTP = null;
        user.forgetPasswordOtpExpiry = null;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully for password reset' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};

// ✅ RESET PASSWORD
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required' });
    }

    try {
        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Ensure OTP verification is completed
        if (user.forgetPasswordOTP || user.forgetPasswordOtpExpiry) {
            return res.status(400).json({ message: 'Please verify OTP before resetting password' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error });
    }
};

export { register, verifyOTP, login, resendOtp, forgetPassword, verifyForgetPassword, resetPassword };
