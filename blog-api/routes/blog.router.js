const express = require("express");
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controller.js");

const { authenticateToken } = require("../middleware/middleware.js");

const {
  registerUser,
  loginUser,
  deleteUser,
} = require("../controllers/user.controller.js");

//blog routes
router.post("/", authenticateToken, createBlog);
router.get("/post", getBlogs);
router.get("/post/:id", getBlogById);
router.put("/post/:id", authenticateToken, updateBlog);
router.delete("/post/:id", authenticateToken, deleteBlog);

//user routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.delete("/auth/deleteMe/:id", authenticateToken, deleteUser);

module.exports = router;
