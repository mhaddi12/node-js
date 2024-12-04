const express = require("express");
const router = express.Router();
const token = require("../middlewares/token");
const userController = require("../controllers/user.controller");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/users", token, userController.getAllUsers);

router.post("/forget-password", userController.forgetPassword);

router.post("/verify-otp", userController.verifyOtp);

module.exports = router;
