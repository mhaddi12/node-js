const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Temporary store for OTPs (use a database in production)
let otpStore = {};

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
}

// Gmail transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Send email
async function sendEmail(toEmail, subject, textContent, htmlContent) {
  const mailOptions = {
    from: `"Game Support" <${process.env.EMAIL}>`,
    to: toEmail,
    subject: subject,
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
}

// Request OTP endpoint
app.post("/request-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = generateOTP();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP valid for 5 minutes

  try {
    const subject = "Facebook OTP Verification";
    const textContent = `Your OTP is: ${otp}. It is valid for 5 minutes.`;
    const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f9;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #4CAF50;
          text-align: center;
          font-size: 36px;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
          padding: 10px;
          background-color: #eaf7e1;
          border-radius: 5px;
          text-align: center;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #888;
        }
        .footer a {
          color: #4CAF50;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Your OTP Code</h1>
        <p>Hello,</p>
        <p>Your OTP is: <span class="otp">${otp}</span>. It is valid for 5 minutes.</p>
        <p>Please enter this OTP in the application to complete the verification.</p>
        <div class="footer">
          <p>If you did not request this, please ignore this email.</p>
          <p>Thank you for using our service!</p>
          <p><a href="http://localhost:3000?email=${email}&otp=${otp}">Visit our website</a></p>
        </div>
      </div>
    </body>
  </html>
`;

    await sendEmail(email, subject, textContent, htmlContent);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP endpoint
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const record = otpStore[email];

  if (!record) {
    return res.status(404).json({ error: "OTP not found or expired" });
  }

  if (record.otp !== parseInt(otp, 10)) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(400).json({ error: "OTP has expired" });
  }

  delete otpStore[email]; // Remove OTP after successful verification
  res.status(200).json({ message: "OTP verified successfully" });
});

// Health Check Endpoint
app.get("/", (req, res) => {
  const { email, otp } = req.query;

  if (!email || !otp) {
    return res
      .status(400)
      .send("Missing email or OTP in the query parameters.");
  }

  const record = otpStore[email];

  if (!record) {
    return res.status(404).send("OTP not found or expired");
  }

  // Check if OTP matches and is not expired
  if (record.otp !== parseInt(otp, 10)) {
    return res.status(400).send("Invalid OTP");
  }

  if (Date.now() > record.expiresAt) {
    return res.status(400).send("OTP has expired");
  }

  // OTP is valid, you can perform additional actions (like user authentication)
  delete otpStore[email]; // Remove OTP after successful verification

  // HTML response on success
  const successHtml = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            padding: 50px;
            text-align: center;
          }
          .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
          }
          h1 {
            color: #4CAF50;
            font-size: 36px;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #4CAF50;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
          }
          .footer a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>OTP Verified Successfully!</h1>
          <p>Your OTP has been verified successfully. You are now authenticated and can access your account.</p>
          <p>Thank you for verifying your identity!</p>
          <div class="footer">
            <p>If you did not request this verification, please ignore this message.</p>
            <p>Thank you for using our service!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  res.status(200).send(successHtml);
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
