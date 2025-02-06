const express = require("express");
const curdRouter = require("./routes/curd.route");

const app = express();

app.use(express.json());

const connectDB = require("./config/db");

connectDB();

app.use("/api", curdRouter);

app.listen(5000, () => console.log("Server started..."));
