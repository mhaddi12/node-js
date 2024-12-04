const express = require("express");

const router = express.Router();

const middleware = require("../middlewares/middleware.js");

const {
  createTask,
  getTasks,
  getTaskById,
  deleteTask,
  updateTask,
  completeTask,
  getTasksByCompletion,
} = require("../controllers/task.controller");

const { register, login } = require("../controllers/user.controller");

router.post("/createTask", middleware, createTask);
router.get("/getTask", middleware, getTasks);
router.get("/getTask/:id", middleware, getTaskById);
router.delete("/deleteTask/:id", middleware, deleteTask);
router.put("/updateTask/:id", middleware, updateTask);
router.put("/completeTask/:id", middleware, completeTask);
router.get("/getTasksByCompletion", middleware, getTasksByCompletion);

//regsiter

router.post("/register", register);
router.post("/login", login);

module.exports = router;
