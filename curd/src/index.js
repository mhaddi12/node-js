const express = require("express");
const curdRouter = require("../routes/curd.route");
const connectDB = require("../config/db");

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api", curdRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
