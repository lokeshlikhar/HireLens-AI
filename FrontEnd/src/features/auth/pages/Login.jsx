import { useState } from "react";
import "../auth.css";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../../../components/ErrorPopup.jsx";

const Login = () => {
  const { loading, error, clearError, handleLogin } = useAuth();
  const navigate = useNavigate();

  //two way binding
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedInUser = await handleLogin({ email, password });
    if (loggedInUser) navigate("/");
  };

  if (loading) {
    return (
      <main className="auth-page">
        <h1>Loading...</h1>
      </main>
    );
  }
  return (
    <main className="auth-page">
      <ErrorPopup message={error} onClose={clearError} />
      <div className="auth-card">
        <header className="auth-brand">
          <p className="auth-brand__eyebrow">HireLens AI</p>
          <h1>Welcome back</h1>
          <p>Sign in to create and revisit interview strategies.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              name="email"
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-submit">
            Login
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
