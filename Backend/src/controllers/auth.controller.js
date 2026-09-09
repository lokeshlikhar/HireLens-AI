import User from "../models/userModel.js";
import { validateSignUp } from "../validation/validation.js";
import bcrypt from "bcrypt";
import validator from "validator";
import BlackListModel from "../models/blacklist.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 4 * 60 * 60 * 1000, // 4 hours
};

/**
 *
 * @description take username , email and password ..and create new user
 */
export const signUpUserController = async (req, res) => {
  //never trust req.body
  try {
    validateSignUp(req); //validate req.body
    const { username, email, password } = req.body;

    const user = await User.findOne({ email }); //check user already exists or not
    if (user) {
      return res.status(400).json({
        message: "user is already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10); //create bcrypt hash of password and store hash in db

    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save(); //save newUser in db
    const jwtToken = await newUser.getJWT(); //getJWt from userSchema method
    res.cookie("token", jwtToken, cookieOptions);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

/**
 *
 * @description takes email and password ..validate it ..find the user ..and also create jwttoken and pass it with cookie
 */
export const loginUserController = async (req, res) => {
  try {
    //validate email and password
    const { email, password } = req.body;
    const isValidEmail = validator.isEmail(email); //first check email is actual a email or not ..also check for strongPassword
    if (!isValidEmail) {
      throw new Error("Invalid Credential");
    }
    const isPassword = validator.isStrongPassword(password);
    if (!isPassword) {
      throw new Error("Invalid Credential");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Wrong email or password");
    }

    const isUserEnterPasswordValid = await user.isPasswordValid(password); //it will true/false
    if (isUserEnterPasswordValid) {
      const jwtToken = await user.getJWT(); //get jwt token ..store in cookie
      res.cookie("token", jwtToken, cookieOptions);
      return res.status(200).json({
        success: true,
        message: "Login  successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({
        message: "email or password is incorrect",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

/**
 * @description logoutcontroller  . expexts token in cookies
 */
export const logoutController = async (req, res) => {
  try {
    const { token } = req.cookies;
    const blacklist = new BlackListModel({
      token: token,
    });
    await blacklist.save();
    res.clearCookie("token", cookieOptions);
    res.json({
      message: "logout successfully !!",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

/**
 * @description getUserProfileController .. find is tokenblocklist or not ..then it give return username and email also id
 *
 */
export const getUserProfileController = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) {
      throw new Error("You must be loggedIn first");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({
      message: "get profile successfull",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
