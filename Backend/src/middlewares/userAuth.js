import jwt from "jsonwebtoken";
import BlackListModel from "../models/blacklist.js";
/**
 *
 * @description check user is logged in or not by verifying token and add user id in req.userId
 */
export const userAuth = async (req, res, next) => {
  try {
    if (!req.cookies) {
      throw new Error("cannot find token");
    }
    const { token } = req.cookies;

    if (!token) {
      throw new Error("cannot find token");
    }
    const isBlacklisted = await BlackListModel.exists({ token });
    if (isBlacklisted) {
      throw new Error("Session has expired. Please log in again.");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decode;
    if (!id) {
      throw new Error("you must be login first");
    }
    req.userId = id;
    next();
  } catch (err) {
    return res.status(401).json({
      message: err.message,
    });
  }
};
