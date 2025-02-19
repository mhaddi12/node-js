const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', urlRoutes);

app.listen(port, () => {
  console.log(`URL Shortener service running at http://localhost:${port}`);
});