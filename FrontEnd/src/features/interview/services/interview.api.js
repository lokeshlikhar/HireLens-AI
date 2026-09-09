import api from "../../../services/api.js";

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  if (resumeFile) formData.append("resume", resumeFile);

  const response = await api.post("/api/interview", formData);
  return response.data.interviewReport;
};

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data.interviewReport;
};

export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview");
  return response.data.interviewReports;
};
