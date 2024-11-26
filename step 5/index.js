const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin access

// Directory for storing uploads
const uploadDir = path.join(__dirname, "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the uploads directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using a timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer
const upload = multer({ storage });

// Logger middleware to track requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url} from ${req.ip}`);
  next();
});

// Define a GET route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the File Upload Server!");
});

// Define a POST route for file upload
app.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(500).send({ error: "File upload failed", details: err });
    }
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    res.send({
      message: "File uploaded successfully!",
      fileName: req.file.filename,
      filePath: path.join(uploadDir, req.file.filename),
    });
  });
});

// Get the local IP address for the server
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "localhost"; // Fallback if no IP is found
};

// Start the server
const PORT = 3000;
const localIP = getLocalIPAddress();
app.listen(PORT, localIP, () => {
  console.log(`Server running at http://${localIP}:${PORT}`);
});
