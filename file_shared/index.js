const http = require("http");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `http://${req.hostname}:3000/uploads/${req.file.filename}`;

  io.emit("file-shared", { filename: req.file.originalname, fileUrl });

  res.json({ message: "File uploaded successfully", fileUrl });
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
