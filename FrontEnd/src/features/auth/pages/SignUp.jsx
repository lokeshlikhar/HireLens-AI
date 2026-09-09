import { useState } from "react";
import "../auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import ErrorPopup from "../../../components/ErrorPopup.jsx";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loading, error, clearError, handleSignup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createdUser = await handleSignup({ username, email, password });
    if (createdUser) navigate("/");
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
          <h1>Create your account</h1>
          <p>Build a focused interview plan tailored to each role.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              required
              placeholder="Enter your username"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              required
              value={email}
              placeholder="Enter your email address"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              required
              value={password}
              placeholder="Enter your password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-submit">
            SignUp
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default SignUp;
