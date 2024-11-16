const express = require("express");
const app = express();
const routes = require("./routes/blog.router");
const connectDB = require("./config/db");

connectDB();

const PORT = 3000 || process.env.PORT;

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Accept", "application/json");
  next();
});

app.use(express.json());
app.use("/blog", routes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
