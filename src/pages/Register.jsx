// src/pages/Register.jsx
import { useMemo, useState } from "react";


const CLIMATES = ["Warm", "Temperate", "Cold"];
const NET = ["Low", "Medium", "High"];
const LIFESTYLE = [
  "Safety",
  "Nightlife",
  "Nature",
  "Expat community",
  "Walkability",
  "Coworking",
];

const TIMEZONE_OPTIONS = [
    "UTC-12:00",
    "UTC-11:00",
    "UTC-10:00",
    "UTC-09:00",
    "UTC-08:00 (PST)",
    "UTC-07:00 (MST)",
    "UTC-06:00 (CST)",
    "UTC-05:00 (EST)",
    "UTC-04:00",
    "UTC-03:00",
    "UTC-02:00",
    "UTC-01:00",
    "UTC+00:00 (GMT)",
    "UTC+01:00 (CET)",
    "UTC+02:00",
    "UTC+03:00",
    "UTC+04:00",
    "UTC+05:00",
    "UTC+05:30 (IST)",
    "UTC+06:00",
    "UTC+07:00",
    "UTC+08:00 (CST/SGT)",
    "UTC+09:00 (JST/KST)",
    "UTC+10:00",
    "UTC+11:00",
    "UTC+12:00",
    "UTC+13:00",
    "UTC+14:00",
  ];

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    language: "",
    origin: "",
    jobTitle: "",
    climate: "Temperate",
    net: "Medium",
    lifestyle: [],
    budgetMin: 1000,
    budgetMax: 1500,
    agreeTos: false, // REQUIRED
    agreeData: false, // Optional
  });

  // pretty budget label
  const budgetLabel = useMemo(
    () =>
      `$${Number(form.budgetMin).toLocaleString()} – $${Number(
        form.budgetMax
      ).toLocaleString()}`,
    [form.budgetMin, form.budgetMax]
  );

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // toggle chips (single or multi)
  function toggleChip(key, value, single = false) {
    if (single) return update(key, value);
    setForm((f) => {
      const set = new Set(f[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...f, [key]: Array.from(set) };
    });
  }

  // clamp helpers for budget fields
  function onBudgetMin(v) {
    const raw = Number(v) || 0;
    const min = Math.max(500, Math.min(raw, 9800));
    setForm((f) => {
      const max = Math.max(f.budgetMax, min + 100);
      return { ...f, budgetMin: min, budgetMax: max };
    });
  }

  function onBudgetMax(v) {
    const raw = Number(v) || 0;
    const max = Math.min(10000, Math.max(raw, 600));
    setForm((f) => {
      const min = Math.min(f.budgetMin, max - 100);
      return {
        ...f,
        budgetMax: Math.max(max, (f.budgetMin || 0) + 100),
        budgetMin: min,
      };
    });
  }

  // quick budget presets
  function setBudgetPreset(min, max) {
    setForm((f) => ({ ...f, budgetMin: min, budgetMax: max }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.agreeTos) {
      alert("Please agree to the Privacy Policy & Terms to continue.");
      return;
    }
    // TODO: send to your API
    alert("Account created (demo).");
  }

  return (
    <div className="auth-bg">
      <div className="container">
        {/* Ensure wrappers never trap scroll */}
        <div
          className="auth-wrap"
          style={{ overflow: "visible", height: "auto", maxHeight: "none" }}
        >
          <div
            className="auth-card register-card"
            style={{ overflow: "visible", height: "auto", maxHeight: "none" }}
          >
            <h1 className="auth-title">Create your NomadPal account</h1>

            {/* Whole page scrolls */}
            <form
              className="register-form"
              onSubmit={submit}
              style={{ overflow: "visible", height: "auto", maxHeight: "none" }}
            >
              {/* 1) Account */}
              <section className="form-section">
                <h3 className="section-title">
                  1) Account Information <span>(Required)</span>
                </h3>
                <div className="form-grid two">
                  <label>
                    <span>Email address</span>
                    <input
                      type="email"
                      placeholder="you@domain.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    <span>Password</span>
                    <input
                      type="password"
                      placeholder="Enter a strong password"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      required
                    />
                  </label>
                </div>
              </section>

              {/* 2) Basic Profile */}
              <section className="form-section">
                <h3 className="section-title">
                  2) Basic Profile Information <span>(Optional)</span>
                </h3>
                <div className="form-grid two">
                  <label>
                    <span>Display name / nickname</span>
                    <input
                      placeholder="NomadNina"
                      value={form.displayName}
                      onChange={(e) => update("displayName", e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Preferred communication language</span>
                    <input
                      placeholder="English (optional)"
                      value={form.language}
                      onChange={(e) => update("language", e.target.value)}
                    />
                  </label>
                  <label className="full">
                    <span>Country of residence / origin city</span>
                    <input
                      placeholder="e.g., Lisbon, Portugal"
                      value={form.origin}
                      onChange={(e) => update("origin", e.target.value)}
                    />
                  </label>
                  <label className="full">
                    <span>Passport</span>
                    <input
                      placeholder="e.g. Portugese Passport"
                      value={form.passport}
                      onChange={(e) => update("passport", e.target.value)}
                    />
                  </label>
                  <label className="full">
                  <span>Timezone</span>
                    <div className="select-wrap">
                        <select
                        className="input-like"
                        value={form.timezone}
                        onChange={(e) => update("timezone", e.target.value)}
                        >
                        <option value="">Select a timezone</option>
                        {TIMEZONE_OPTIONS.map((tz) => (
                            <option key={tz} value={tz}>
                            {tz}
                            </option>
                        ))}
                        </select>
                    </div>
                </label>

                </div>
              </section>

              {/* 3) Personal Preferences (pretty & systematic) */}
              <section className="form-section">
                <h3 className="section-title">3) Personal Preferences</h3>

                <div className="prefs-grid">
                  {/* Job title */}
                  <label className="full">
                    <span>Job title / field</span>
                    <input
                      placeholder="e.g., Frontend Developer"
                      value={form.jobTitle}
                      onChange={(e) => update("jobTitle", e.target.value)}
                    />
                    <small className="hint">
                      We’ll tailor job matches and city suggestions to this role.
                    </small>
                  </label>

                  {/* Budget */}
                  <fieldset className="pref-card">
                    <legend>Monthly budget range (USD)</legend>

                    <div className="budget-row">
                      <div className="budget-input">
                        <label>
                          <span className="sr-only">
                            Minimum monthly budget
                          </span>
                          <input
                            aria-label="Minimum monthly budget"
                            type="number"
                            min="500"
                            max={form.budgetMax - 100}
                            step="50"
                            value={form.budgetMin}
                            onChange={(e) => onBudgetMin(e.target.value)}
                          />
                        </label>
                        <span className="dash">–</span>
                        <label>
                          <span className="sr-only">
                            Maximum monthly budget
                          </span>
                          <input
                            aria-label="Maximum monthly budget"
                            type="number"
                            min={form.budgetMin + 100}
                            max="10000"
                            step="50"
                            value={form.budgetMax}
                            onChange={(e) => onBudgetMax(e.target.value)}
                          />
                        </label>
                      </div>

                      <div
                        className="budget-presets"
                        role="group"
                        aria-label="Budget presets"
                      >
                        <button
                          type="button"
                          className="chip"
                          onClick={() => setBudgetPreset(800, 1200)}
                        >
                          Starter $800–$1,200
                        </button>
                        <button
                          type="button"
                          className="chip"
                          onClick={() => setBudgetPreset(1200, 2000)}
                        >
                          Comfort $1,200–$2,000
                        </button>
                        <button
                          type="button"
                          className="chip"
                          onClick={() => setBudgetPreset(2000, 3500)}
                        >
                          Premium $2,000–$3,500
                        </button>
                      </div>
                    </div>

                    <div className="budget-hint strong">{budgetLabel}</div>
                  </fieldset>

                  {/* Climate (radios as chips) */}
                  <fieldset className="pref-card">
                    <legend>Preferred climate</legend>
                    <div className="chips">
                      {CLIMATES.map((c) => (
                        <label
                          key={c}
                          className={`chip ${
                            form.climate === c ? "selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="climate"
                            value={c}
                            checked={form.climate === c}
                            onChange={() => update("climate", c)}
                          />
                          {c}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Internet speed (radios as chips) */}
                  <fieldset className="pref-card">
                    <legend>Internet speed requirement</legend>
                    <div className="chips">
                      {NET.map((n) => (
                        <label
                          key={n}
                          className={`chip ${form.net === n ? "selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="net"
                            value={n}
                            checked={form.net === n}
                            onChange={() => update("net", n)}
                          />
                          {n}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Lifestyle (checkboxes as chips) */}
                  <fieldset className="pref-card full">
                    <legend>
                      Lifestyle priorities{" "}
                      <span className="muted">(multi-select)</span>
                    </legend>
                    <div className="chips grid-3">
                      {LIFESTYLE.map((l) => {
                        const active = form.lifestyle.includes(l);
                        return (
                          <label
                            key={l}
                            className={`chip ${active ? "selected" : ""}`}
                          >
                            <input
                              type="checkbox"
                              value={l}
                              checked={active}
                              onChange={() => toggleChip("lifestyle", l)}
                            />
                            {l}
                          </label>
                        );
                      })}
                    </div>
                    <small className="hint">
                      We’ll boost cities that align with your priorities.
                    </small>
                  </fieldset>
                </div>
              </section>

              {/* 4) Consent */}
              <section className="form-section">
                <h3 className="section-title">4) Consent & Compliance</h3>
                <div className="consent">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={form.agreeData}
                      onChange={(e) => update("agreeData", e.target.checked)}
                    />
                    <span>
                      I consent to data use for personalized recommendations
                    </span>
                  </label>
                </div>
              </section>

              {/* Submit area (flows with page) */}
              <div className="reg-actions" style={{ gap: 16 }}>
                <label className="checkbox" style={{ alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={form.agreeTos}
                    onChange={(e) => update("agreeTos", e.target.checked)}
                    required
                  />
                  <span>
                    I agree to the <a href="#">Privacy Policy &amp; Terms</a>
                  </span>
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="btn primary"
                    type="submit"
                    disabled={!form.agreeTos}
                    aria-disabled={!form.agreeTos}
                    title={
                      !form.agreeTos ? "Please agree to the Terms first" : ""
                    }
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* site-wide footer can live outside the card if needed */}
      </div>
    </div>
  );
}
