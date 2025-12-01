import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import auth from './routes/auth.routes.js';
import db from './config/db.js'; // Assuming you have a db.js for MongoDB connection

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Example route
app.use('/auth', auth);

// Database connection
db();
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});