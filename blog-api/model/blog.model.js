const mongoose = require("mongoose");
require("dotenv").config();

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

blogSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.blog_post_id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
