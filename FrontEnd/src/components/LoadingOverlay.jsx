import "./loading-overlay.css";

const LoadingOverlay = ({ message = "Working on your interview plan…" }) => (
  <main
    className="loading-screen"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="loading-card">
      <span className="loading-spinner" aria-hidden="true" />
      <h1>{message}</h1>
      <p>Please wait.</p>
    </div>
  </main>
);

export default LoadingOverlay;
