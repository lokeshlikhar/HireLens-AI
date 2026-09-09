import Groq from "groq-sdk";

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("AI service is not configured.");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

const interviewReportJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      description: "the title of job for which resume interview is generated",
    },
    matchScore: {
      type: "number",
      description:
        "The match score between the candidate and the job description between 0 and 100",
    },
    technicalQuestions: {
      type: "array",
      description:
        "Technical questions that can be asked in the interview, with intention and answer. Give a maximum of 5 questions.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The Technical Questions can be asked in the Interview",
          },
          intention: {
            type: "string",
            description:
              "The intention of the interviewer behind asking these question",
          },
          answer: {
            type: "string",
            description:
              "How to answer these questions , what points to cover,what approach to follow in short",
          },
        },
        required: ["question", "intention", "answer"],
        additionalProperties: false,
      },
    },
    behavioralQuestions: {
      type: "array",
      description:
        "Behavioral questions that can be asked in the interview, with intention and answer. Give a maximum of 4 questions.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The Behavioral Questions can be asked in the Interview",
          },
          intention: {
            type: "string",
            description:
              "The intention of the interviewer behind asking these question",
          },
          answer: {
            type: "string",
            description:
              "How to answer these questions , what points to cover,what approach to follow in short",
          },
        },
        required: ["question", "intention", "answer"],
        additionalProperties: false,
      },
    },
    skillGap: {
      type: "array",
      description:
        "The skill gap between the candidate and the job description with severity give maximun 4 skill gap",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The skill which the candidate is lacking",
          },
          severity: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["skill", "severity"],
        additionalProperties: false,
      },
    },
    preparationPlan: {
      type: "array",
      description:
        "The preparation plan for the interview, day wise with focus area and tasks to be done for maximun 6 days",
      items: {
        type: "object",
        properties: {
          day: {
            type: "integer",
            description: "The day of the preparation plan start from 1",
          },
          focus: {
            type: "string",
            description: "The focus area for the preparation on that day",
          },
          tasks: {
            type: "array",
            minItems: 1,
            maxItems: 2,
            items: {
              type: "string",
              description: "A specific preparation task to complete that day",
            },
          },
        },
        required: ["day", "focus", "tasks"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGap",
    "preparationPlan",
  ],
};
export const callGroq = async ({ resume, selfDescription, jobDescription }) => {
  const response = await getGroqClient().chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "user",
        content: `Generate an interview report for a candidate with the following details:
                    Resume: ${resume} Self Description : ${selfDescription}
                    Job Description: ${jobDescription}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "interviewReport",
        strict: true,
        schema: interviewReportJSONSchema,
      },
    },
  });
  const content = response.choices[0].message.content;
  if (!content) throw new Error("AI service returned an empty response.");
  const result = JSON.parse(content);
  return result;
};
