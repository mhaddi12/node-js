const http = require("http");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Handle file upload from client
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filePath = `/uploads/${req.file.filename}`;
  io.emit("file-received", { filePath });
  res.json({ message: "File uploaded successfully", filePath });
});

io.on("connection", (socket) => {
  console.log(`A new user has been connected: ${socket.id}`);

  socket.on("user-message", (message) => {
    io.emit("message", message);
  });

  socket.on("file-upload", (file) => {
    console.log("File received:", file);
  });
});

// Serve static files
app.use(express.static(path.resolve("./public")));
app.use("/uploads", express.static(path.resolve("./uploads"))); // Serve uploaded files

app.get("/", (req, res) => {
  return res.sendFile(path.resolve("./public/index.html"));
});

server.listen(3000, () => console.log("Server running on port 3000"));
