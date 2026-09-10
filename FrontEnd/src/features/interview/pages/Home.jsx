import { useEffect, useState, useRef } from "react";
import "../styles/home.css";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../../../components/ErrorPopup.jsx";
import LoadingOverlay from "../../../components/LoadingOverlay.jsx";
import { useAuth } from "../../auth/hooks/useAuth.js";
const Home = () => {
  const { loading, error, clearError, generateReport, reports, getAllReports } =
    useInterview();
  const {
    user,
    loading: authLoading,
    error: authError,
    clearError: clearAuthError,
    handleLogout,
  } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();
  const [localError, setLocalError] = useState("");
  const [selectedResumeName, setSelectedResumeName] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const missingFields = [];
    if (!jobDescription.trim()) missingFields.push("job description");
    if (!resumeFile) missingFields.push("PDF resume");
    if (!selfDescription.trim()) missingFields.push("self description");
    if (missingFields.length)
      return setLocalError(
        `All fields are required. Please provide: ${missingFields.join(", ")}.`,
      );
    if (
      resumeFile &&
      (resumeFile.type !== "application/pdf" ||
        resumeFile.size > 3 * 1024 * 1024)
    ) {
      return setLocalError("Resume must be a PDF no larger than 3 MB.");
    }
    setLocalError("");
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    if (data?._id) navigate(`/interview/${data._id}`);
  };

  const handleLogoutClick = async () => {
    setLocalError("");
    const didLogout = await handleLogout();
    if (didLogout) navigate("/login", { replace: true });
  };

  const isBusy = loading || authLoading;

  return (
    <div className="home-page">
      {isBusy && (
        <LoadingOverlay
          message={
            authLoading ? "Signing you out…" : "Loading your interview data…"
          }
        />
      )}
      <ErrorPopup
        message={localError || error || authError}
        onClose={() => {
          setLocalError("");
          clearError();
          clearAuthError();
        }}
      />
      {/* Page Header */}
      <header className="page-header">
        <div className="home-user-bar"></div>
        <h1>
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
        <p className="usage-notice">
          This project uses a limited-token LLM API and is made for learning
          purposes only.
        </p>
      </header>

      {/* Main Card */}
      <div className="interview-card">
        <div className="interview-card__body">
          {/* Left Panel - Job Description */}
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="panel__textarea"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              maxLength={5000}
              disabled={isBusy}
            />
            <div className="char-counter">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="panel-divider" />

          {/* Right Panel - Profile */}
          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <h2>
                <p className="welcome-message">
                  Welcome back, <strong>{user?.username || "there"}</strong>
                </p>
              </h2>
              <button
                className="logout-btn"
                type="button"
                onClick={handleLogoutClick}
                disabled={isBusy}
              >
                Log out
              </button>
            </div>

            {/* Upload Resume */}
            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--required">Required</span>
              </label>
              <label className="dropzone" htmlFor="resume">
                <span className="dropzone__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </span>
                <p className="dropzone__title">
                  {selectedResumeName || "Click to upload or drag & drop"}
                </p>
                <p className="dropzone__subtitle">
                  {selectedResumeName
                    ? "PDF selected — ready to generate"
                    : "PDF only (Max 3MB)"}
                </p>
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept="application/pdf,.pdf"
                  disabled={isBusy}
                  onChange={(event) =>
                    setSelectedResumeName(event.target.files?.[0]?.name || "")
                  }
                />
              </label>
            </div>

            {/* Quick Self-Description */}
            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
                <span className="badge badge--required">Required</span>
              </label>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience..."
                maxLength={400}
                disabled={isBusy}
              />
              <div className="self-description__counter">
                {selfDescription.length} / 400 chars
              </div>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <span className="info-box__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <p>
                A <strong>PDF Resume</strong>, <strong>Job Description</strong>,
                and <strong>Self Description</strong> are required to generate a
                personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="interview-card__footer">
          <span className="footer-info">
            AI-Powered Strategy Generation &bull; Approx 30s
          </span>
          <button
            className="generate-btn"
            onClick={handleGenerateReport}
            disabled={isBusy}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Generate My Interview Strategy
          </button>
        </div>
      </div>

      <section
        className="recent-reports"
        aria-labelledby="recent-reports-heading"
      >
        <div className="recent-reports__header">
          <div>
            <h2 id="recent-reports-heading">Your previous reports</h2>
          </div>
        </div>
        {reports.length === 0 ? (
          <div className="reports-empty">
            You have no reports generated yet.
          </div>
        ) : (
          <div className="reports-list">
            {reports.map((previousReport) => (
              <article className="report-item" key={previousReport._id}>
                <div>
                  <h3>{previousReport.title || "Interview report"}</h3>
                  <p>
                    Created at{" "}
                    {new Date(previousReport.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="report-item__score">
                  Match score: <strong>{previousReport.matchScore}%</strong>
                </p>
                <button
                  type="button"
                  className="view-report-btn"
                  disabled={isBusy}
                  onClick={() => navigate(`/interview/${previousReport._id}`)}
                >
                  View report
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Page Footer */}

      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  );
};

export default Home;
