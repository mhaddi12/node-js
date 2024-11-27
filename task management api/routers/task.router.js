const express = require("express");
const router = express.Router();
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



router.post("/createTask", createTask);
router.get("/getTask", getTasks);
router.get("/getTask/:id", getTaskById);
router.delete("/deleteTask/:id", deleteTask);
router.put("/updateTask/:id", updateTask);
router.put("/completeTask/:id", completeTask);
router.get("/getTasksByCompletion", getTasksByCompletion);

//regsiter

router.post("/register", register);
router.post("/login", login);

module.exports = router;
