import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { generateInteviewReportController } from "../controllers/interview.controller.js";
import upload from "../middlewares/interview.js";
import { getInterviewReportByIdController } from "../controllers/interview.controller.js";
import { getAllInteviewReportOfLoggedInUserController } from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

/**
 * @route post /api/interview
 * @description generate new interview report on the basis of resume , self Description and job Description
 * @access Private
 */
interviewRouter.post(
  "/",
  userAuth,
  upload.single("resume"),
  generateInteviewReportController,
);

/**
 * @route get /api/interview/report/;interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get(
  "/report/:interviewId",
  userAuth,
  getInterviewReportByIdController,
);

/**
 * @route get /api/interview
 * @description get all the intevire report of loggedIn user
 * @access private
 */
interviewRouter.get(
  "/",
  userAuth,
  getAllInteviewReportOfLoggedInUserController,
);
export default interviewRouter;
