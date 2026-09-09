import { useAuth } from "../hooks/useAuth.js";
import { Navigate } from "react-router-dom";
import LoadingOverlay from "../../../components/LoadingOverlay.jsx";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <LoadingOverlay message="Checking your session…" />;
  }
  if (!user) {
    return <Navigate to={"/login"}></Navigate>;
  }
  return children;
};

export default Protected;
