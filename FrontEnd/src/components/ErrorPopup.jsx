import { useEffect } from "react";
import "./error-popup.css";

const ErrorPopup = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return undefined;
    const timeout = window.setTimeout(onClose, 7000);
    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="error-popup" role="alert" aria-live="assertive">
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss error">
        &times;
      </button>
    </div>
  );
};

export default ErrorPopup;
