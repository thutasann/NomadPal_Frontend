import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  // Auto-redirect after a short pause (optional)
  useEffect(() => {
    const t = setTimeout(() => navigate("/login"), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="auth-bg">
      <div className="container">
        <div className="auth-wrap">
          <div className="auth-card auth-center">
            <div className="status-icon success">
              {/* checkmark */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="11" className="ring"/>
                <path d="M7 12.5l3.2 3.2L17 9" className="tick"/>
              </svg>
            </div>

            <h1 className="auth-title">You’ve been logged out</h1>
            <p className="auth-subtitle">See you next time, and stay wander-ready ✈️</p>

            <div className="actions">
              <a className="btn primary block" href="/login">Sign in again</a>
              <a className="btn block" href="/">Back to Home</a>
            </div>

            <p className="auth-foot small">Redirecting to sign in…</p>
          </div>
        </div>
      </div>
    </div>
  );
}
