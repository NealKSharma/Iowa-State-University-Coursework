import { useState } from "react";
import { logClientError } from "../utils/errorLogger.js";

function Login({ apiBase, initialMode, onAuth, onNavigate }) {
  //this keeps the text typed into the login/signup boxes.
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSignup = initialMode === "signup";

  function selectMode(nextMode) {
    //this swaps the url between /login and /signup.
    onNavigate(nextMode);
  }

  function updateField(event) {
    //this updates whichever input box the user is typing in.
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitForm(event) {
    //this is what sends the form to the backend auth api.
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const endpoint = isSignup ? "register" : "login";
    const payload = isSignup
      ? form
      : { email: form.email, password: form.password };

    try {
      const response = await fetch(`${apiBase}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      //if login/signup worked, App.jsx stores the session and redirects.
      onAuth(data);
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, {
        area: isSignup ? "signup" : "login",
        email: form.email,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-panel auth-panel-info">
          <p className="eyebrow">Saint Cy's Hospital</p>
          <h1>{isSignup ? "Create Account" : "Secure Login"}</h1>
          <p>
            Patients can create an account here. Staff accounts are managed by the hospital.
          </p>
        </div>

        <form className="auth-panel auth-form" onSubmit={submitForm}>
          <div className="auth-tabs" aria-label="Authentication mode">
            <button
              className={initialMode === "login" ? "active" : ""}
              type="button"
              onClick={() => selectMode("login")}
            >
              Log In
            </button>
            <button
              className={initialMode === "signup" ? "active" : ""}
              type="button"
              onClick={() => selectMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {isSignup && (
            <label>
              Full name
              <input
                autoComplete="name"
                name="name"
                onChange={updateField}
                required
                type="text"
                value={form.name}
              />
            </label>
          )}

          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={updateField}
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            Password
            <span className="password-field">
              <input
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={isSignup ? 8 : undefined}
                name="password"
                onChange={updateField}
                required
                type={showPassword ? "text" : "password"}
                value={form.password}
              />
              <button
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          {message && <p className="form-message">{message}</p>}

          <button className="btn-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Working..." : isSignup ? "Create Account" : "Log In"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
