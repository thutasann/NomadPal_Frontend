// src/pages/Login.jsx
import { useState } from "react";

export default function Login() {          // <-- default export here
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-bg">
      <div className="container">
        <div className="auth-wrap">
          <div className="auth-card">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Log in to continue to NomadPal.</p>

            <form className="auth-form" onSubmit={(e)=>e.preventDefault()}>
              <label>
                <span>Email</span>
                <input type="email" placeholder="you@example.com" required />
              </label>

              <label>
                <span>Password</span>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <div className="form-row">
                <a className="link" href="#">Forgot Password?</a>
              </div>

              <button className="btn primary block" type="submit">Login</button>
            </form>

            <p className="auth-foot">
              Don’t have an account? <a className="link" href="Register">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
