import express from "express";
const authRouter = express.Router();
// import authController from "../controllers/auth.controller.js";
import {
  signUpUserController,
  loginUserController,
  logoutController,
  getUserProfileController,
} from "../controllers/auth.controller.js";
import { userAuth } from "../middlewares/userAuth.js";

/**
 * @route  -POST /api/auth/signup
 * @description -to sign new user
 */
authRouter.post("/signup", signUpUserController);

/**
 * @route post /api/auth/login
 * @description to login user with email and password
 */
authRouter.post("/login", loginUserController);

/**
 * @route get /api/auth/logout
 * @description to logout user and blacklist the token
 */
authRouter.get("/logout", userAuth, logoutController);
export default authRouter;

/**
 * @route get /api/auth/profile
 * @description to get user details
 */
authRouter.get("/profile", userAuth, getUserProfileController);
