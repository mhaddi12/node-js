import express from "express";
import token from "../middlewares/token.js";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/users", token, userController.getAllUsers);
router.post("/forget-password", userController.forgetPassword);
router.post("/verify-otp", userController.verifyOtp);

export default router;
