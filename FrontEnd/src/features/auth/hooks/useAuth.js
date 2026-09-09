import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.js";
import { signup, login, logout, getProfile } from "../services/auth.api.js";

const errorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong.";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  const { user, setUser, loading, setLoading, error, setError } = context;

  const handleSignup = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const data = await signup(credentials);
      setUser(data.user);
      return data.user;
    } catch (requestError) {
      setError(errorMessage(requestError));
      return null;
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const data = await login(credentials);
      setUser(data.user);
      return data.user;
    } catch (requestError) {
      setError(errorMessage(requestError));
      return null;
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      await logout();
      setUser(null);
      return true;
    } catch (requestError) {
      setError(errorMessage(requestError));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        setUser((await getProfile()).user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getAndSetUser();
  }, [setLoading, setUser]);

  return {
    user,
    loading,
    error,
    clearError: () => setError(""),
    handleSignup,
    handleLogin,
    handleLogout,
  };
};
