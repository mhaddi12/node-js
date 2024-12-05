import User from "../models/user.model.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpModel from "../models/otp.model.mjs";

let otpStore = {}; // Temporary in-memory store for OTPs (use DB in production)

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

// Helper function to send emails
const sendEmail = async (toEmail, subject, textContent, htmlContent) => {
  const mailOptions = {
    from: `"Game Support" <${process.env.EMAIL}>`,
    to: toEmail,
    subject,
    text: textContent,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Name, email, and password are required.",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already in use.",
      });
    }

    // Hash the password
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    await otpModel.findOneAndUpdate(
      { email },
      {
        email,
        password: hashedPassword,
        name,
        hashedOtp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      },
      { upsert: true, new: true }
    );

    const subject = "Password Reset OTP";
    const textContent = `Your OTP is: ${otp}. It is valid for 5 minutes.`;
    const htmlContent = `
      <html>
        <body>
          <div style="font-family: Arial, sans-serif; text-align: center;">
            <h1>Password Reset OTP</h1>
            <p>Your OTP is:</p>
            <h2 style="color: #4CAF50;">${otp}</h2>
            <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    await sendEmail(email, subject, textContent, htmlContent);

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while registering the user.",
    });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and password are required.",
      });
    }

    // Check if the user exists and verify the password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while logging in.",
    });
  }
};

// Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching users.",
    });
  }
};

// Forgot Password
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        status: "fail",
        message: "Email is required.",
      });
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), salt);

    // Store hashed OTP with expiry
    otpStore[email] = { hashedOtp, expiresAt: Date.now() + 5 * 60 * 1000 };

    const subject = "OTP Register";
    const textContent = `Your OTP is: ${otp}. It is valid for 5 minutes.`;
    const htmlContent = `
      <html>
        <body>
          <div style="font-family: Arial, sans-serif; text-align: center;">
            <h1>Password Reset OTP</h1>
            <p>Your OTP is:</p>
            <h2 style="color: #4CAF50;">${otp}</h2>
            <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    await sendEmail(email, subject, textContent, htmlContent);

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to send OTP.",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        status: "fail",
        message: "Email, OTP, password, and name are required.",
      });
    }

    // Fetch OTP data from the database
    const otpData = await otpModel.findOne({ email });
    if (!otpData) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or expired OTP.",
      });
    }

    // Check if OTP is expired
    if (Date.now() > new Date(otpData.expiresAt).getTime()) {
      await otpModel.deleteOne({ email }); // Clean up expired OTP
      return res.status(400).json({
        status: "fail",
        message: "OTP has expired.",
      });
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp.toString(), otpData.hashedOtp);
    if (!isOtpValid) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid OTP.",
      });
    }

    // Save user to the database after successful OTP verification
    const user = new User({
      name: otpData.name,
      email,
      password: otpData.password,
    });

    await user.save();

    // Clean up OTP data
    await otpModel.deleteOne({ email });

    res.status(200).json({
      status: "success",
      message: "User verified and registered successfully.",
    });
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while verifying OTP.",
    });
  }
};
