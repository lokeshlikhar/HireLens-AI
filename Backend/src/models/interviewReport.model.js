import mongoose from "mongoose";

/**
 * job description - string
 * resusme text - string
 * self descriptipn - string
 *
 * - matchScore : number,
 * - technical question [{
 *          - question -"",
 *           - intention - "",
 *            - answer you cab give - ""
 *          }]
 * - behaviroal question[{
 *          - question -"",
 *           - intention - "",
 *            - answer you cab give - ""
 *          }]
 * - preparation plan[{day - number , focus - string , tasks - [string]}]
 * - skill gap[{
 *      - skill:string,
 *         - severity : {
 *          type : string,
 *              enum : ["low" , "medium" , "high"]}
 *      }]
 */
const technicalQuestionsSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "technical question required"],
    },
    intention: {
      type: String,
      required: [true, "intention is required"],
    },
    answer: {
      type: String,
      required: [true, "answer in required"],
    },
  },
  {
    _id: false,
  },
);
const behavioralQuestionsSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "behavioral question required"],
    },
    intention: {
      type: String,
      required: [true, "intention is required"],
    },
    answer: {
      type: String,
      required: [true, "answer in required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
    },
    tasks: {
      type: [String],
      required: [true, "task is required"],
    },
  },
  {
    _id: false,
  },
);
const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "job description is required"],
    },
    resume: {
      type: String,
      required: [true, "resume is required"],
    },
    selfDescription: {
      type: String,
      required: [true, "Self Description is required"],
      maxlength: [400, "Self Description must be 400 characters or fewer"],
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: [true, "Match Score is required"],
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    preparationPlan: [preparationPlanSchema],
    skillGap: [skillGapSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    title: {
      type: String,
      required: [true, "job title is required"],
    },
  },
  {
    timestamps: true,
  },
);

const InterviewReportModel = new mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

export default InterviewReportModel;
