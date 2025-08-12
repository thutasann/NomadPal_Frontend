import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginSchema } from "../validations/auth.validation";
import authService from "../services/auth.service";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function submit(e) {
    e.preventDefault();
    
    try {
      // Validate form data with Zod
      const validatedData = loginSchema.parse(form);
      
      // Show loading toast
      const loadingToast = toast.loading('Logging you in...');

      // Call the login API
      authService.login(validatedData)
        .then((response) => {
          toast.dismiss(loadingToast);
          toast.success('Login successful! Welcome back!');
          console.log('Login successful:', response);
          // TODO: Store token and redirect to dashboard
        })
        .catch((error) => {
          toast.dismiss(loadingToast);
          console.error('Login failed:', error);
          toast.error(error.message || 'Login failed. Please try again.');
        });
      
    } catch (validationError) {
      // Handle Zod validation errors
      if (validationError.errors && validationError.errors.length > 0) {
        const firstError = validationError.errors[0];
        toast.error(firstError.message);
        
        // Focus on the first field with an error
        const fieldName = firstError.path[0];
        const fieldElement = document.querySelector(`[name="${fieldName}"]`);
        if (fieldElement) {
          fieldElement.focus();
        }
      } else {
        toast.error('Please check your form and try again.');
      }
    }
  }

  return (
    <div className="auth-bg">
      <div className="container">
        <div className="auth-wrap">
          <div className="auth-card">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Log in to continue to NomadPal.</p>

            <form className="auth-form" onSubmit={submit}>
              <label>
                <span>Email</span>
                <input 
                  name="email"
                  type="email" 
                  placeholder="you@example.com" 
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required 
                />
              </label>

              <label>
                <span>Password</span>
                <div className="password-field">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
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
              Don't have an account? <a className="link" href="/register">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
