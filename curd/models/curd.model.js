const mongoose = require("mongoose");

const curdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("curd", curdSchema, "curd");
