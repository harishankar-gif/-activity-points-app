import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requestedPath = location.state?.from?.pathname;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!uid.trim() || !password) {
      setError("Enter both UID and password.");
      return;
    }
    const result = login(uid, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    const fallback = result.role === "admin" ? "/admin" : "/dashboard";
    navigate(requestedPath || fallback, { replace: true });
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-seal">AP</div>
        <h1 className="login-title">Activity Points Ledger</h1>
        <p className="login-sub">Sign in with your student UID, or as admin to review activities</p>

        <div className="field">
          <label htmlFor="uid">UID</label>
          <input
            id="uid"
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="e.g. 21CS045 or admin"
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn-primary">Sign in</button>

        <div className="login-hint">
          Student accounts: <code>21CS045 / pass123</code>,{" "}
          <code>21EC102 / pass456</code>, <code>22ME018 / pass789</code>.
          <br />
          Admin account: <code>admin / admin123</code>.
          <br />
          Checked against <code>src/data/students.json</code> and{" "}
          <code>src/data/admins.json</code> — no backend is used.
        </div>
      </form>
    </div>
  );
}
