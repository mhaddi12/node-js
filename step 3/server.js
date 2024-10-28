const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => console.log("Connected!"));
app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
