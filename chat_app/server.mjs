import express from "express";
import connectDB from "./configs/db.mjs";
import router from "./routes/router.mjs";

import dotenv from "dotenv";

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(token);

// Routes
app.use(router);

// Start the server
const port = process.env.PORT || 3000; // Default port fallback
app.listen(port, () => console.log(`Server started on port ${port}`));

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
