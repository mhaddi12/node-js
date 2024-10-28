const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
