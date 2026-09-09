import { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  generateInterviewReport,
  getAllInterviewReports,
  getInterviewReportById,
} from "../services/interview.api";
import { InterviewContext } from "../interview.context.js";

const errorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong.";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context)
    throw new Error("useInterview must be used within InterviewProvider");

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    error,
    setError,
  } = context;
  const { interviewId } = useParams();

  const generateReport = useCallback(
    async ({ jobDescription, selfDescription, resumeFile }) => {
      setLoading(true);
      setError("");
      try {
        const interviewReport = await generateInterviewReport({
          jobDescription,
          selfDescription,
          resumeFile,
        });
        setReport(interviewReport);
        return interviewReport;
      } catch (requestError) {
        setError(errorMessage(requestError));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, setReport],
  );

  const getReportById = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const interviewReport = await getInterviewReportById(id);
        setReport(interviewReport);
        return interviewReport;
      } catch (requestError) {
        setReport(null);
        setError(errorMessage(requestError));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, setReport],
  );

  const getAllReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const interviewReports = await getAllInterviewReports();
      setReports(interviewReports);
      return interviewReports;
    } catch (requestError) {
      setError(errorMessage(requestError));
      return [];
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setReports]);

  useEffect(() => {
    if (interviewId) getReportById(interviewId);
  }, [getReportById, interviewId]);

  return {
    loading,
    report,
    reports,
    error,
    clearError: () => setError(""),
    generateReport,
    getReportById,
    getAllReports,
  };
};
