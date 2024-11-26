const express = require("express");
const app = express();
const connectDB = require("./configs/db");
const router = require("./routers/task.router");

connectDB();

app.use(express.json());

app.use("/", router);

app.listen(process.env.PORT, () =>
  console.log("Server is running on port 3000")
);
