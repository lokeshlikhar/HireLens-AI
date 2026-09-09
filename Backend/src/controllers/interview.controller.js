import { PDFParse } from "pdf-parse";
import { callGroq } from "../services/ai.groq.js";
import InterviewReportModel from "../models/interviewReport.model.js";

export const generateInteviewReportController = async (req, res) => {
  try {
    const { selfDescription = "", jobDescription = "" } = req.body ?? {};
    if (!jobDescription.trim())
      return res
        .status(400)
        .json({ message: "A job description is required." });
    if (!selfDescription.trim())
      return res
        .status(400)
        .json({ message: "A self description is required." });
    if (selfDescription.length > 400)
      return res
        .status(400)
        .json({ message: "Self description must be 400 characters or fewer." });
    if (!req.file)
      return res.status(400).json({ message: "A PDF resume is required." });

    let resumeText = "";
    if (req.file) {
      const parser = new PDFParse({ data: req.file.buffer });
      try {
        resumeText = (await parser.getText()).text;
      } finally {
        await parser.destroy();
      }
    }

    if (!resumeText.trim())
      return res
        .status(400)
        .json({ message: "The uploaded PDF does not contain readable text." });

    const groqResponse = await callGroq({
      resume: resumeText,
      selfDescription: selfDescription.trim(),
      jobDescription: jobDescription.trim(),
    });
    const interviewReport = await InterviewReportModel.create({
      resume: resumeText,
      jobDescription: jobDescription.trim(),
      selfDescription: selfDescription.trim(),
      user: req.userId,
      ...groqResponse,
    });

    return res
      .status(201)
      .json({
        message: "Interview report generated successfully.",
        interviewReport,
      });
  } catch (error) {
    console.error("Interview report generation failed:", error.message);
    return res
      .status(500)
      .json({
        message:
          "Unable to generate the interview report. Please try again later.",
      });
  }
};

export const getInterviewReportByIdController = async (req, res) => {
  try {
    const interviewReport = await InterviewReportModel.findOne({
      _id: req.params.interviewId,
      user: req.userId,
    });
    if (!interviewReport)
      return res.status(404).json({ message: "Interview report not found." });
    return res
      .status(200)
      .json({
        message: "Interview report fetched successfully.",
        interviewReport,
      });
  } catch {
    return res.status(400).json({ message: "Invalid interview report id." });
  }
};

export const getAllInteviewReportOfLoggedInUserController = async (
  req,
  res,
) => {
  try {
    const interviewReports = await InterviewReportModel.find({
      user: req.userId,
    })
      .sort({ updatedAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGap -preparationPlan",
      );
    return res
      .status(200)
      .json({
        message: "Interview reports fetched successfully.",
        interviewReports,
      });
  } catch {
    return res
      .status(500)
      .json({ message: "Unable to fetch interview reports." });
  }
};
