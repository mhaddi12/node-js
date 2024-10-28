const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  loginUser,
} = require("../controller/user.controller");

const authenticateToken = require("../middleware/authenticateToken");

router.post("/", authenticateToken, createUser);

router.get("/", authenticateToken, getUsers);

router.delete("/:id", authenticateToken, deleteUser);

router.put("/:id", authenticateToken, updateUser);

router.post("/login", authenticateToken, loginUser);

module.exports = router;
