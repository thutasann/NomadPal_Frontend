// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ========= Predefined select data ========= */
const VISA_FLEX_OPTIONS = [
  "Long-stay OK",
  "Short-stay only",
  "Visa on arrival",
  "Requires advance visa",
  "Work visa required",
];

const REGION_OPTIONS = [
  "Schengen",
  "SEA (Southeast Asia)",
  "LATAM (Latin America)",
  "North America",
  "Oceania",
  "Africa",
  "Middle East",
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

/* ========= small helpers ========= */
const slug = (name = "") =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 5c5.2 0 9.2 3.4 10.6 6.7a1.5 1.5 0 0 1 0 1.3C21.2 16.3 17.2 19.6 12 19.6S2.8 16.3 1.4 13a1.5 1.5 0 0 1 0-1.3C2.8 8.4 6.8 5 12 5zm0 2c-4.2 0-7.6 2.7-8.9 5 1.3 2.3 4.7 5 8.9 5s7.6-2.7 8.9-5c-1.3-2.3-4.7-5-8.9-5zm0 2.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6z"
      />
    </svg>
  );
}

/* =========================
   Small Glass Modal (inline)
========================= */
function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* =========================
   Reusable helpers
========================= */
const ErrorText = ({ children }) =>
  children ? <div style={{ color: "#b91c1c", fontSize: 13, marginTop: 6 }}>{children}</div> : null;

function TextInput({ label, value, onChange, placeholder, type = "text", required, name }) {
  return (
    <label>
      <span>{label}{required ? " *" : ""}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function NumberInput({ label, value, onChange, placeholder, min, max, step = 1, required, name }) {
  return (
    <label>
      <span>{label}{required ? " *" : ""}</span>
      <input
        name={name}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
      />
    </label>
  );
}

/* =========================
   Compact Card wrapper
========================= */
function Card({ title, onEdit, children, footer }) {
  return (
    <section className="p-card">
      <div className="p-card-top">
        {title && <h3 className="p-card-title">{title}</h3>}
        {onEdit && (
          <button className="btn small" onClick={onEdit} type="button">Edit</button>
        )}
      </div>
      <div className="p-card-body">{children}</div>
      {footer ? <div className="p-card-footer">{footer}</div> : null}
    </section>
  );
}

/* =========================
   Main Profile Page
========================= */
export default function Profile() {
  const [user, setUser] = useState({
    overview: {
      name: "Nomad Nina",
      email: "nina@example.com",
      savedCities: 8,
      savedJobs: 3,
      lastRun: "2d ago",
      completeness: 50,
    },
    personal: {
      displayName: "Nomad Nina",
      language: "English",
      countryCity: "Portugal, Lisbon (LIS)",
      timeZone: "UTC+00:00 (GMT)",
    },
    travel: {
      passport: "Portugal",
      visaFlex: "Long-stay OK",
      regions: "Schengen",
    },
    work: {
      jobTitle: "Frontend Developer",
      salary: 60000,
      salaryUnit: "year",
      sources: "Adzuna, Remotive",
      workStyle: "Async-friendly",
    },
    budget: {
      monthly: 1500,
      housing: "1-bed apartment",
      colSensitivity: "Medium",
    },
    saved: {
      cities: [
        { id: 1, name: "Lisbon", cost: 1500, net: 100, safety: 75 },
        { id: 2, name: "Chiang Mai", cost: 900, net: 80, safety: 82 },
      ],
      jobs: [
        { id: 1, role: "Frontend Dev", company: "RemoteCo", status: "Applied" },
        { id: 2, role: "UI Designer", company: "NomadLabs", status: "Interested" },
      ],
    },
    privacy: { consentNews: true, consentResearch: false },
  });

  // recompute counts when lists change
  useEffect(() => {
    setUser((u) => ({
      ...u,
      overview: {
        ...u.overview,
        savedCities: u.saved.cities.length,
        savedJobs: u.saved.jobs.length,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.saved?.cities?.length, user.saved?.jobs?.length]);

  // Which editor is open?
  const [editor, setEditor] = useState(null);
  const close = () => setEditor(null);

  // remove handlers
  const removeCity = (id) => {
    if (!window.confirm("Remove this city from your saved list?")) return;
    setUser((u) => ({
      ...u,
      saved: { ...u.saved, cities: u.saved.cities.filter((c) => c.id !== id) },
    }));
  };

  const removeJob = (id) => {
    if (!window.confirm("Remove this job from your saved list?")) return;
    setUser((u) => ({
      ...u,
      saved: { ...u.saved, jobs: u.saved.jobs.filter((j) => j.id !== id) },
    }));
  };

  return (
    <div className="profile-bg">
      <div className="container">
        <header className="p-head profile-header">
          <h1>Profile</h1>
          <p className="subtitle">Your preferences, saved items, and account settings.</p>
        </header>

        <div className="p-grid">
          {/* Left column */}
          <div className="p-col">
            <Card title="Profile Overview">
              <div className="p-overview">
                <div className="avatar" aria-hidden />
                <div>
                  <div className="p-name">{user.overview.name}</div>
                  <div className="muted">{user.overview.email}</div>
                  <div className="muted p-meta">
                    Saved Cities: {user.overview.savedCities} • Saved Jobs: {user.overview.savedJobs} • Last Run: {user.overview.lastRun}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Personal Info" onEdit={() => setEditor("personal")}>
              <ul className="p-list">
                <li><strong>Display name:</strong> {user.personal.displayName}</li>
                <li><strong>Preferred language:</strong> {user.personal.language}</li>
                <li><strong>Country & City:</strong> {user.personal.countryCity}</li>
                <li className="muted"><strong>Time zone:</strong> {user.personal.timeZone}</li>
              </ul>
            </Card>

            <Card title="Travel Identity" onEdit={() => setEditor("travel")}>
              <ul className="p-list">
                <li><strong>Passport:</strong> {user.travel.passport}</li>
                <li><strong>Visa flexibility:</strong> {user.travel.visaFlex}</li>
                <li><strong>Preferred regions:</strong> {user.travel.regions}</li>
              </ul>
            </Card>

            <Card title="Work & Job Preferences" onEdit={() => setEditor("work")}>
              <ul className="p-list">
                <li><strong>Job title:</strong> {user.work.jobTitle}</li>
                <li><strong>Target salary:</strong> ${user.work.salary.toLocaleString()}/{user.work.salaryUnit}</li>
                <li><strong>Sources:</strong> {user.work.sources}</li>
                <li className="muted"><strong>Work style:</strong> {user.work.workStyle}</li>
              </ul>
            </Card>

            <Card title="Budget & Living Preferences" onEdit={() => setEditor("budget")}>
              <ul className="p-list">
                <li><strong>Monthly budget:</strong> ${user.budget.monthly.toLocaleString()}</li>
                <li><strong>Housing:</strong> {user.budget.housing}</li>
                <li className="muted"><strong>CoL sensitivity:</strong> {user.budget.colSensitivity}</li>
              </ul>
            </Card>
          </div>

          {/* Right column */}
          <div className="p-col">
            <Card
              title="Profile Completeness"
              footer={<div className="muted">Tip: Fill in Budget, Job Field, and Country/City</div>}
            >
              <div className="p-progress">
                <div className="p-progress-bar" style={{ width: `${user.overview.completeness}%` }} />
              </div>
            </Card>

            {/* Saved Cities: display only + view + remove */}
            <Card title="Saved Cities">
              <ul className="p-list">
                {user.saved.cities.map((c) => (
                  <li key={c.id} className="saved-row" style={rowStyle}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div className="muted">${c.cost}/mo, {c.net} Mbps, Safety {c.safety}</div>
                    </div>
                    <div style={actionsStyle}>
                      <Link
                        to={`/cities/${slug(c.name)}`}
                        className="icon-btn"
                        title="View details"
                        aria-label={`View ${c.name}`}
                        style={iconBtnStyle}
                      >
                        <EyeIcon />
                      </Link>
                      <button
                        className="icon-btn danger"
                        onClick={() => removeCity(c.id)}
                        title="Remove"
                        aria-label={`Remove ${c.name}`}
                        type="button"
                        style={{ ...iconBtnStyle, color: "#b91c1c" }}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
                {user.saved.cities.length === 0 && (
                  <li className="muted">No saved cities yet.</li>
                )}
              </ul>
            </Card>

            {/* Saved Jobs: display only + view + remove */}
            <Card title="Saved Jobs">
              <ul className="p-list">
                {user.saved.jobs.map((j) => (
                  <li key={j.id} className="saved-row" style={rowStyle}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>
                        {j.role} @ {j.company}
                      </div>
                      <div className="muted">{j.status}</div>
                    </div>
                    <div style={actionsStyle}>
                      <Link
                        to={`/jobs/${j.id}`}
                        className="icon-btn"
                        title="View details"
                        aria-label={`View ${j.role} at ${j.company}`}
                        style={iconBtnStyle}
                      >
                        <EyeIcon />
                      </Link>
                      <button
                        className="icon-btn danger"
                        onClick={() => removeJob(j.id)}
                        title="Remove"
                        aria-label={`Remove ${j.role} at ${j.company}`}
                        type="button"
                        style={{ ...iconBtnStyle, color: "#b91c1c" }}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
                {user.saved.jobs.length === 0 && (
                  <li className="muted">No saved jobs yet.</li>
                )}
              </ul>
            </Card>

            <Card title="Privacy & Data" onEdit={() => setEditor("privacy")}>
              <ul className="p-list">
                <li>Weekly newsletter consent: <strong>{user.privacy.consentNews ? "Yes" : "No"}</strong></li>
                <li>Research data consent: <strong>{user.privacy.consentResearch ? "Yes" : "No"}</strong></li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* =========================
          EDIT MODALS (Full forms)
      ========================== */}
      <Modal open={editor === "personal"} title="Edit Personal Info" onClose={close}>
        <PersonalForm
          value={user.personal}
          onCancel={close}
          onSave={(patch) => setUser((u) => ({ ...u, personal: { ...u.personal, ...patch } }))}
        />
      </Modal>

      <Modal open={editor === "travel"} title="Edit Travel Identity" onClose={close}>
        <TravelForm
          value={user.travel}
          onCancel={close}
          onSave={(patch) => setUser((u) => ({ ...u, travel: { ...u.travel, ...patch } }))}
        />
      </Modal>

      <Modal open={editor === "work"} title="Edit Work & Job Preferences" onClose={close}>
        <WorkForm
          value={user.work}
          onCancel={close}
          onSave={(patch) => setUser((u) => ({ ...u, work: { ...u.work, ...patch } }))}
        />
      </Modal>

      <Modal open={editor === "budget"} title="Edit Budget & Living Preferences" onClose={close}>
        <BudgetForm
          value={user.budget}
          onCancel={close}
          onSave={(patch) => setUser((u) => ({ ...u, budget: { ...u.budget, ...patch } }))}
        />
      </Modal>

      <Modal open={editor === "privacy"} title="Edit Privacy & Data" onClose={close}>
        <PrivacyForm
          value={user.privacy}
          onCancel={close}
          onSave={(patch) => setUser((u) => ({ ...u, privacy: { ...u.privacy, ...patch } }))}
        />
      </Modal>
    </div>
  );
}

/* Inline styles for the action buttons (nice without depending on extra CSS) */
const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 0",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};
const actionsStyle = { display: "inline-flex", gap: 8, flexShrink: 0 };
const iconBtnStyle = {
  width: 34,
  height: 34,
  borderRadius: 9999,
  border: "1px solid #e5e7eb",
  background: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#111827",
  cursor: "pointer",
};

/* =========================
   Forms with Validations
========================= */
function PersonalForm({ value, onSave, onCancel }) {
  const [form, setForm] = useState({
    displayName: value.displayName || "",
    language: value.language || "",
    countryCity: value.countryCity || "",
    timeZone: TIMEZONE_OPTIONS.includes(value.timeZone) ? value.timeZone : "UTC+00:00 (GMT)",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.displayName.trim()) e.displayName = "Display name is required.";
    if (!form.countryCity.trim()) e.countryCity = "Country & City is required.";
    return e;
  };

  function submit(e) {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    onSave?.(form);
    onCancel?.();
  }

  return (
    <form className="modal-form" onSubmit={submit}>
      <TextInput label="Display name" value={form.displayName} onChange={(v) => setForm(f => ({...f, displayName: v}))} required />
      <ErrorText>{errors.displayName}</ErrorText>

      <TextInput label="Preferred language" value={form.language} onChange={(v) => setForm(f => ({...f, language: v}))} placeholder="English" />

      <TextInput label="Country & City" value={form.countryCity} onChange={(v) => setForm(f => ({...f, countryCity: v}))} required />
      <ErrorText>{errors.countryCity}</ErrorText>

      <label>
        <span>Time zone</span>
        <select
          className="input"
          value={form.timeZone}
          onChange={(e) => setForm(f => ({ ...f, timeZone: e.target.value }))}
        >
          {TIMEZONE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </label>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Save</button>
      </div>
    </form>
  );
}

function TravelForm({ value, onSave, onCancel }) {
  const [form, setForm] = useState({
    passport: value?.passport || "",
    visaFlex: value?.visaFlex && VISA_FLEX_OPTIONS.includes(value.visaFlex)
      ? value.visaFlex
      : VISA_FLEX_OPTIONS[0],
    regions: value?.regions && REGION_OPTIONS.includes(value.regions)
      ? value.regions
      : REGION_OPTIONS[0],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.passport.trim()) e.passport = "Passport is required.";
    return e;
  };

  function submit(e) {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    onSave?.(form);
    onCancel?.();
  }

  return (
    <form className="modal-form" onSubmit={submit}>
      <TextInput label="Passport" value={form.passport} onChange={(v) => setForm(f => ({...f, passport: v}))} required />
      <ErrorText>{errors.passport}</ErrorText>

      <label>
        <span>Visa flexibility</span>
        <select
          className="input"
          value={form.visaFlex}
          onChange={(e) => setForm(f => ({ ...f, visaFlex: e.target.value }))}
        >
          {VISA_FLEX_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </label>

      <label>
        <span>Preferred regions</span>
        <select
          className="input"
          value={form.regions}
          onChange={(e) => setForm(f => ({ ...f, regions: e.target.value }))}
        >
          {REGION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </label>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Save</button>
      </div>
    </form>
  );
}

function WorkForm({ value, onSave, onCancel }) {
  const [form, setForm] = useState({
    jobTitle: value.jobTitle || "",
    salary: value.salary ?? 0,
    salaryUnit: value.salaryUnit || "year",
    sources: value.sources || "",
    workStyle: value.workStyle || "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (form.jobTitle.trim() === "") e.jobTitle = "Job title is required.";
    if (isNaN(form.salary) || Number(form.salary) <= 0) e.salary = "Enter a valid salary.";
    if (!["year", "month"].includes(form.salaryUnit)) e.salaryUnit = "Choose year or month.";
    return e;
  };

  function submit(e) {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    onSave?.({ ...form, salary: Number(form.salary) });
    onCancel?.();
  }

  return (
    <form className="modal-form" onSubmit={submit}>
      <TextInput label="Job title / field" value={form.jobTitle} onChange={(v) => setForm(f => ({...f, jobTitle: v}))} required />
      <ErrorText>{errors.jobTitle}</ErrorText>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12 }}>
        <NumberInput label="Target salary" value={form.salary} onChange={(v) => setForm(f => ({...f, salary: v}))} min={1} required />
        <label>
          <span>Unit</span>
          <select className="input" value={form.salaryUnit} onChange={(e) => setForm(f => ({...f, salaryUnit: e.target.value}))}>
            <option value="year">per year</option>
            <option value="month">per month</option>
          </select>
        </label>
      </div>
      <ErrorText>{errors.salary || errors.salaryUnit}</ErrorText>

      <TextInput label="Sources" value={form.sources} onChange={(v) => setForm(f => ({...f, sources: v}))} placeholder="Adzuna, Remotive" />
      <TextInput label="Work style" value={form.workStyle} onChange={(v) => setForm(f => ({...f, workStyle: v}))} placeholder="Async-friendly" />

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Save</button>
      </div>
    </form>
  );
}

function BudgetForm({ value, onSave, onCancel }) {
  const [form, setForm] = useState({
    monthly: value.monthly ?? 0,
    housing: value.housing || "",
    colSensitivity: value.colSensitivity || "Medium",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (isNaN(form.monthly) || Number(form.monthly) < 300) e.monthly = "Monthly budget must be ≥ 300.";
    if (!form.housing.trim()) e.housing = "Housing is required.";
    if (!["Low", "Medium", "High"].includes(form.colSensitivity)) e.colSensitivity = "Choose Low, Medium, or High.";
    return e;
  };

  function submit(e) {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    onSave?.({ ...form, monthly: Number(form.monthly) });
    onCancel?.();
  }

  return (
    <form className="modal-form" onSubmit={submit}>
      <NumberInput label="Monthly budget (USD)" value={form.monthly} onChange={(v) => setForm(f => ({...f, monthly: v}))} min={300} step={50} required />
      <ErrorText>{errors.monthly}</ErrorText>

      <TextInput label="Housing" value={form.housing} onChange={(v) => setForm(f => ({...f, housing: v}))} placeholder="1-bed apartment" required />
      <ErrorText>{errors.housing}</ErrorText>

      <label>
        <span>Cost-of-living sensitivity</span>
        <select className="input" value={form.colSensitivity} onChange={(e) => setForm(f => ({...f, colSensitivity: e.target.value}))}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
      </label>
      <ErrorText>{errors.colSensitivity}</ErrorText>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Save</button>
      </div>
    </form>
  );
}

function PrivacyForm({ value, onSave, onCancel }) {
  const [form, setForm] = useState({
    consentNews: !!value.consentNews,
    consentResearch: !!value.consentResearch,
  });

  function submit(e) {
    e.preventDefault();
    onSave?.(form);
    onCancel?.();
  }

  return (
    <form className="modal-form" onSubmit={submit}>
      <label className="checkbox" style={{ alignItems: "center" }}>
        <input
          type="checkbox"
          checked={form.consentNews}
          onChange={(e) => setForm((f) => ({ ...f, consentNews: e.target.checked }))}
        />
        <span>Subscribe to weekly newsletter</span>
      </label>

      <label className="checkbox" style={{ alignItems: "center" }}>
        <input
          type="checkbox"
          checked={form.consentResearch}
          onChange={(e) => setForm((f) => ({ ...f, consentResearch: e.target.checked }))}
        />
        <span>Allow anonymized research data usage</span>
      </label>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Save</button>
      </div>
    </form>
  );
}
