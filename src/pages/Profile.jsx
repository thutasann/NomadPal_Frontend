// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";

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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { user, isLoading, loadProfile, updateProfile, removeCity, removeJob, loadSavedCities, loadSavedJobs } = useUser();
  
  // Track if data has been loaded to prevent infinite loops
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load profile data when component mounts or when authentication changes
  useEffect(() => {
    console.log('Profile useEffect triggered:', { isAuthenticated, dataLoaded });
    
    if (isAuthenticated && !dataLoaded) {
      console.log('Loading profile data...');
      setDataLoaded(true);
      
      // Load all data in parallel
      Promise.all([
        loadProfile(),
        loadSavedCities(),
        loadSavedJobs()
      ]).catch(error => {
        console.error('Error loading profile data:', error);
        setDataLoaded(false); // Reset on error so we can retry
      });
    }
  }, [isAuthenticated, dataLoaded]); // Only depend on isAuthenticated and dataLoaded flag

  // Manual refresh function
  const handleRefresh = async () => {
    console.log('Manual refresh triggered');
    setDataLoaded(false);
    try {
      await Promise.all([
        loadProfile(),
        loadSavedCities(),
        loadSavedJobs()
      ]);
      setDataLoaded(true);
      toast.success('Profile refreshed successfully');
    } catch (error) {
      console.error('Error refreshing profile:', error);
      toast.error('Failed to refresh profile');
    }
  };

  // Which editor is open?
  const [editor, setEditor] = useState(null);
  const close = () => setEditor(null);

  // Remove handlers
  const handleRemoveCity = async (cityId) => {
    if (!window.confirm("Remove this city from your saved list?")) return;
    
    try {
      await removeCity(cityId);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleRemoveJob = async (jobId) => {
    if (!window.confirm("Remove this job from your saved list?")) return;
    
    try {
      await removeJob(jobId);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  // Calculate profile completeness
  const calculateCompleteness = () => {
    if (!user) return 0;
    
    const fields = [
      user.display_name,
      user.country_city,
      user.job_title,
      user.monthly_budget_min_usd,
      user.monthly_budget_max_usd,
      user.preferred_climate,
      user.internet_speed_requirement,
      user.lifestyle_priorities?.length > 0
    ];
    
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="profile-bg">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div>Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-bg">
      <div className="container">
        <header className="p-head profile-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Profile</h1>
              <p className="subtitle">Your preferences, saved items, and account settings.</p>
            </div>
          </div>
        </header>

        <div className="p-grid">
          {/* Left column */}
          <div className="p-col">
            <Card title="Profile Overview">
              <div className="p-overview">
                <div className="avatar" aria-hidden />
                <div>
                  <div className="p-name">{user.display_name || 'Not set'}</div>
                  <div className="muted">{user.email}</div>
                  <div className="muted p-meta">
                    Saved Cities: {user.saved_cities?.length || 0} • Saved Jobs: {user.saved_jobs?.length || 0} • Last Updated: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Personal Info" onEdit={() => setEditor("personal")}>
              <ul className="p-list">
                <li><strong>Display name:</strong> {user.display_name || 'Not set'}</li>
                <li><strong>Preferred language:</strong> {user.preferred_language || 'Not set'}</li>
                <li><strong>Country & City:</strong> {user.country_city || 'Not set'}</li>
                <li className="muted"><strong>Time zone:</strong> {user.timezone || 'Not set'}</li>
              </ul>
            </Card>

            <Card title="Travel Identity" onEdit={() => setEditor("travel")}>
              <ul className="p-list">
                <li><strong>Passport:</strong> {user.passport || 'Not set'}</li>
                <li><strong>Visa flexibility:</strong> {user.visa_flexibility || 'Not set'}</li>
                <li><strong>Preferred regions:</strong> {user.preferred_regions || 'Not set'}</li>
              </ul>
            </Card>

            <Card title="Work & Job Preferences" onEdit={() => setEditor("work")}>
              <ul className="p-list">
                <li><strong>Job title:</strong> {user.job_title || 'Not set'}</li>
                <li><strong>Target salary:</strong> {user.target_salary_usd ? `$${user.target_salary_usd.toLocaleString()}/${user.salary_currency || 'USD'}` : 'Not set'}</li>
                <li><strong>Sources:</strong> {user.sources || 'Not set'}</li>
                <li className="muted"><strong>Work style:</strong> {user.work_style || 'Not set'}</li>
              </ul>
            </Card>

            <Card title="Budget & Living Preferences" onEdit={() => setEditor("budget")}>
              <ul className="p-list">
                <li><strong>Monthly budget:</strong> {user.monthly_budget_min_usd && user.monthly_budget_max_usd ? `$${user.monthly_budget_min_usd.toLocaleString()} - $${user.monthly_budget_max_usd.toLocaleString()}` : 'Not set'}</li>
                <li><strong>Preferred climate:</strong> {user.preferred_climate || 'Not set'}</li>
                <li className="muted"><strong>Internet speed:</strong> {user.internet_speed_requirement || 'Not set'}</li>
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
                <div className="p-progress-bar" style={{ width: `${calculateCompleteness()}%` }} />
              </div>
            </Card>

            {/* Saved Cities: display only + view + remove */}
            <Card title="Saved Cities">
              <ul className="p-list">
                {user.saved_cities && user.saved_cities.length > 0 ? (
                  user.saved_cities.map((city) => (
                    <li key={city.id} className="saved-row" style={rowStyle}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600 }}>{city.name}</div>
                        <div className="muted">${city.monthly_cost_usd}/mo, {city.country}</div>
                      </div>
                      <div style={actionsStyle}>
                        <Link
                          to={`/cities/${city.slug || slug(city.name)}`}
                          className="icon-btn"
                          title="View details"
                          aria-label={`View ${city.name}`}
                          style={iconBtnStyle}
                        >
                          <EyeIcon />
                        </Link>
                        <button
                          className="icon-btn danger"
                          onClick={() => handleRemoveCity(city.id)}
                          title="Remove"
                          aria-label={`Remove ${city.name}`}
                          type="button"
                          style={{ ...iconBtnStyle, color: "#b91c1c" }}
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="muted">No saved cities yet.</li>
                )}
              </ul>
            </Card>

            {/* Saved Jobs: display only + view + remove */}
            <Card title="Saved Jobs">
              <ul className="p-list">
                {user.saved_jobs && user.saved_jobs.length > 0 ? (
                  user.saved_jobs.map((job) => (
                    <li key={job.id} className="saved-row" style={rowStyle}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600 }}>
                          {job.title} @ {job.company}
                        </div>
                        <div className="muted">{job.status || 'Interested'}</div>
                      </div>
                      <div style={actionsStyle}>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="icon-btn"
                          title="View details"
                          aria-label={`View ${job.title} at ${job.company}`}
                          style={iconBtnStyle}
                        >
                          <EyeIcon />
                        </Link>
                        <button
                          className="icon-btn danger"
                          onClick={() => handleRemoveJob(job.id)}
                          title="Remove"
                          aria-label={`Remove ${job.title} at ${job.company}`}
                          type="button"
                          style={{ ...iconBtnStyle, color: "#b91c1c" }}
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="muted">No saved jobs yet.</li>
                )}
              </ul>
            </Card>

            <Card title="Privacy & Data" onEdit={() => setEditor("privacy")}>
              <ul className="p-list">
                <li>Weekly newsletter consent: <strong>{user.newsletter_consent ? "Yes" : "No"}</strong></li>
                <li>Research data consent: <strong>{user.research_consent ? "Yes" : "No"}</strong></li>
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
          value={user}
          onCancel={close}
          onSave={async (patch) => {
            try {
              await updateProfile(patch);
              close();
            } catch (error) {
              // Error is already handled in the hook
            }
          }}
          isLoading={isLoading}
        />
      </Modal>

      <Modal open={editor === "travel"} title="Edit Travel Identity" onClose={close}>
        <TravelForm
          value={user}
          onCancel={close}
          onSave={async (patch) => {
            try {
              await updateProfile(patch);
              close();
            } catch (error) {
              // Error is already handled in the hook
            }
          }}
          isLoading={isLoading}
        />
      </Modal>

      <Modal open={editor === "work"} title="Edit Work & Job Preferences" onClose={close}>
        <WorkForm
          value={user}
          onCancel={close}
          onSave={async (patch) => {
            try {
              await updateProfile(patch);
              close();
            } catch (error) {
              // Error is already handled in the hook
            }
          }}
          isLoading={isLoading}
        />
      </Modal>

      <Modal open={editor === "budget"} title="Edit Budget & Living Preferences" onClose={close}>
        <BudgetForm
          value={user}
          onCancel={close}
          onSave={async (patch) => {
            try {
              await updateProfile(patch);
              close();
            } catch (error) {
              // Error is already handled in the hook
            }
          }}
          isLoading={isLoading}
        />
      </Modal>

      <Modal open={editor === "privacy"} title="Edit Privacy & Data" onClose={close}>
        <PrivacyForm
          value={user}
          onCancel={close}
          onSave={async (patch) => {
            try {
              await updateProfile(patch);
              close();
            } catch (error) {
              // Error is already handled in the hook
            }
          }}
          isLoading={isLoading}
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
function PersonalForm({ value, onSave, onCancel, isLoading }) {
  const [form, setForm] = useState({
    display_name: value.display_name || "",
    preferred_language: value.preferred_language || "",
    country_city: value.country_city || "",
    timezone: TIMEZONE_OPTIONS.includes(value.timezone) ? value.timezone : "UTC+00:00 (GMT)",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.display_name.trim()) e.display_name = "Display name is required.";
    if (!form.country_city.trim()) e.country_city = "Country & City is required.";
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
      <TextInput label="Display name" value={form.display_name} onChange={(v) => setForm(f => ({...f, display_name: v}))} required />
      <ErrorText>{errors.display_name}</ErrorText>

      <TextInput label="Preferred language" value={form.preferred_language} onChange={(v) => setForm(f => ({...f, preferred_language: v}))} placeholder="English" />

      <TextInput label="Country & City" value={form.country_city} onChange={(v) => setForm(f => ({...f, country_city: v}))} required />
      <ErrorText>{errors.country_city}</ErrorText>

      <label>
        <span>Time zone</span>
        <select
          className="input"
          value={form.timezone}
          onChange={(e) => setForm(f => ({ ...f, timezone: e.target.value }))}
        >
          {TIMEZONE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </label>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function TravelForm({ value, onSave, onCancel, isLoading }) {
  const [form, setForm] = useState({
    passport: value?.passport || "",
    visa_flexibility: value?.visa_flexibility && VISA_FLEX_OPTIONS.includes(value.visa_flexibility)
      ? value.visa_flexibility
      : VISA_FLEX_OPTIONS[0],
    preferred_regions: value?.preferred_regions && REGION_OPTIONS.includes(value.preferred_regions)
      ? value.preferred_regions
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
          value={form.visa_flexibility}
          onChange={(e) => setForm(f => ({ ...f, visa_flexibility: e.target.value }))}
        >
          {VISA_FLEX_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </label>

      <label>
        <span>Preferred regions</span>
        <select
          className="input"
          value={form.preferred_regions}
          onChange={(e) => setForm(f => ({ ...f, preferred_regions: e.target.value }))}
        >
          {REGION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </label>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function WorkForm({ value, onSave, onCancel, isLoading }) {
  const [form, setForm] = useState({
    job_title: value.job_title || "",
    target_salary_usd: value.target_salary_usd ?? 0,
    salary_currency: value.salary_currency || "USD",
    sources: value.sources || "",
    work_style: value.work_style || "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (form.job_title.trim() === "") e.job_title = "Job title is required.";
    if (isNaN(form.target_salary_usd) || Number(form.target_salary_usd) <= 0) e.target_salary_usd = "Enter a valid salary.";
    if (!["USD", "EUR", "GBP"].includes(form.salary_currency)) e.salary_currency = "Choose a valid currency.";
    return e;
  };

  function submit(e) {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    onSave?.({ ...form, target_salary_usd: Number(form.target_salary_usd) });
    onCancel?.();
  }

  return (
    <form className="modal-form" onSubmit={submit}>
      <TextInput label="Job title / field" value={form.job_title} onChange={(v) => setForm(f => ({...f, job_title: v}))} required />
      <ErrorText>{errors.job_title}</ErrorText>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12 }}>
        <NumberInput label="Target salary" value={form.target_salary_usd} onChange={(v) => setForm(f => ({...f, target_salary_usd: v}))} min={1} required />
        <label>
          <span>Unit</span>
          <select className="input" value={form.salary_currency} onChange={(e) => setForm(f => ({...f, salary_currency: e.target.value}))}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
      </div>
      <ErrorText>{errors.target_salary_usd || errors.salary_currency}</ErrorText>

      <TextInput label="Sources" value={form.sources} onChange={(v) => setForm(f => ({...f, sources: v}))} placeholder="Adzuna, Remotive" />
      <TextInput label="Work style" value={form.work_style} onChange={(v) => setForm(f => ({...f, work_style: v}))} placeholder="Async-friendly" />

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function BudgetForm({ value, onSave, onCancel, isLoading }) {
  const [form, setForm] = useState({
    monthly_budget_min_usd: value.monthly_budget_min_usd ?? 0,
    monthly_budget_max_usd: value.monthly_budget_max_usd ?? 0,
    preferred_climate: value.preferred_climate || "Any",
    internet_speed_requirement: value.internet_speed_requirement || "Any",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (isNaN(form.monthly_budget_min_usd) || Number(form.monthly_budget_min_usd) < 300) e.monthly_budget_min_usd = "Monthly budget must be ≥ 300.";
    if (isNaN(form.monthly_budget_max_usd) || Number(form.monthly_budget_max_usd) < 300) e.monthly_budget_max_usd = "Monthly budget must be ≥ 300.";
    if (!form.preferred_climate.trim()) e.preferred_climate = "Preferred climate is required.";
    if (!form.internet_speed_requirement.trim()) e.internet_speed_requirement = "Internet speed requirement is required.";
    return e;
  };

  function submit(e) {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    onSave?.({ ...form, monthly_budget_min_usd: Number(form.monthly_budget_min_usd), monthly_budget_max_usd: Number(form.monthly_budget_max_usd) });
    onCancel?.();
  }

  return (
    <form className="modal-form" onSubmit={submit}>
      <NumberInput label="Monthly budget (USD)" value={form.monthly_budget_min_usd} onChange={(v) => setForm(f => ({...f, monthly_budget_min_usd: v}))} min={300} step={50} required />
      <ErrorText>{errors.monthly_budget_min_usd}</ErrorText>

      <NumberInput label="Monthly budget (USD)" value={form.monthly_budget_max_usd} onChange={(v) => setForm(f => ({...f, monthly_budget_max_usd: v}))} min={300} step={50} required />
      <ErrorText>{errors.monthly_budget_max_usd}</ErrorText>

      <TextInput label="Preferred climate" value={form.preferred_climate} onChange={(v) => setForm(f => ({...f, preferred_climate: v}))} placeholder="Any" required />
      <ErrorText>{errors.preferred_climate}</ErrorText>

      <TextInput label="Internet speed requirement" value={form.internet_speed_requirement} onChange={(v) => setForm(f => ({...f, internet_speed_requirement: v}))} placeholder="Any" required />
      <ErrorText>{errors.internet_speed_requirement}</ErrorText>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function PrivacyForm({ value, onSave, onCancel, isLoading }) {
  const [form, setForm] = useState({
    newsletter_consent: !!value.newsletter_consent,
    research_consent: !!value.research_consent,
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
          checked={form.newsletter_consent}
          onChange={(e) => setForm((f) => ({ ...f, newsletter_consent: e.target.checked }))}
        />
        <span>Subscribe to weekly newsletter</span>
      </label>

      <label className="checkbox" style={{ alignItems: "center" }}>
        <input
          type="checkbox"
          checked={form.research_consent}
          onChange={(e) => setForm((f) => ({ ...f, research_consent: e.target.checked }))}
        />
        <span>Allow anonymized research data usage</span>
      </label>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
