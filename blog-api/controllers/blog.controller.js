const Blog = require("../model/blog.model");
const User = require("../model/user.model");
const { uploadToCloudinary } = require("../middleware/upload");
const path = require("path");

exports.createBlog = async (req, res) => {
  const { title, description, userId } = req.body;
  const filename = Date.now() + path.extname(req.file.originalname);
  try {
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      filename
    );
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newBlog = new Blog({
      title,
      description,
      image: cloudinaryResult.secure_url,
      userId: existingUser._id,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const { title, description, image } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description, image },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
