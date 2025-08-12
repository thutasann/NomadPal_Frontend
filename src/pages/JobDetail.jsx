// src/pages/JobDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export function mapAdzunaToVM(adzunaJob) {
  if (!adzunaJob) return null;
  const {
    id, title, company = {}, location = {}, category = {},
    created, contract_type, contract_time, description,
    redirect_url, salary_min, salary_max, salary_is_predicted, source,
  } = adzunaJob;

  const daysAgo = created
    ? Math.max(0, Math.floor((Date.now() - new Date(created).getTime()) / 86400000))
    : null;

  return {
    id: id?.toString() || "",
    title: title || "—",
    company: company?.display_name || "—",
    location: location?.display_name || "—",
    category: category?.label || "—",
    postedAgo: daysAgo != null ? `Posted ${daysAgo} day${daysAgo === 1 ? "" : "s"} ago` : "",
    employment: [contract_time, contract_type]
      .filter(Boolean)
      .map((t) => String(t).replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()))
      .join(" • "),
    salaryText:
      salary_min || salary_max
        ? new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
            .format(Math.round(salary_min || salary_max)) +
          " – " +
          new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
            .format(Math.round(salary_max || salary_min)) +
          (salary_is_predicted === "1" ? " (predicted)" : "")
        : null,
    description: description || "",
    applyUrl: redirect_url || "#",
    source: source || "Adzuna",
  };
}

export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ loading: true, error: "" });

  // Demo VM until you wire the API
  const demo = useMemo(
    () =>
      mapAdzunaToVM({
        id: jobId || "jobId",
        title: "Frontend Developer",
        company: { display_name: "LisbonTech" },
        location: { display_name: "Lisbon, Portugal" },
        category: { label: "IT Jobs" },
        created: new Date(Date.now() - 3 * 86400000).toISOString(),
        contract_type: "permanent",
        contract_time: "full_time",
        description:
          "Join our fast-paced team building cutting-edge web applications using React and Node.js. Collaborate with a great team on scalable products.\n\nView full job details on the source site.",
        redirect_url: "#",
        salary_min: 45000,
        salary_max: 55000,
        salary_is_predicted: "1",
        source: "Adzuna",
      }),
    [jobId]
  );

  useEffect(() => {
    let ignore = false;
    async function load() {
      setStatus({ loading: true, error: "" });
      try {
        // TODO: replace with real API call to Adzuna (or your backend proxy)
        const vm = demo;
        if (!ignore) {
          setJob(vm);
          setStatus({ loading: false, error: "" });
        }
      } catch (e) {
        if (!ignore) setStatus({ loading: false, error: "Failed to load job." });
      }
    }
    load();
    return () => (ignore = true);
  }, [demo]);

  function onSave() {
    setSaving(true);
    // TODO: POST /api/saved-jobs
    setTimeout(() => setSaving(false), 600);
  }

  if (status.loading) return <div className="container narrow" style={{ padding: 24 }}>Loading…</div>;
  if (status.error || !job) return <div className="container narrow" style={{ padding: 24 }}>Job not found.</div>;

  return (
    <div className="job-page">
      <div className="container narrow">
        <header className="job-head">
          <h1>Jobs in Lisbon, Portugal</h1>
          <h2>{job.title}</h2>

          <div className="job-meta">
            {job.employment && (
              <span className="meta-pill"><span className="dot" />{job.employment}</span>
            )}
            {job.postedAgo && (
              <span className="meta-pill"><span className="dot" />{job.postedAgo}</span>
            )}
          </div>
        </header>

        <section className="job-card" aria-labelledby="job-info">
          <h3 id="job-info">Company & Details</h3>
          <ul className="job-list">
            <li><strong>Company:</strong><span>{job.company}</span></li>
            <li><strong>Location:</strong><span>{job.location}</span></li>
            <li><strong>Category:</strong><span>{job.category}</span></li>
          </ul>
        </section>

        <section className="job-card" aria-labelledby="comp">
          <h3 id="comp">Compensation</h3>
          <div style={{ fontWeight: 700 }}>{job.salaryText || "—"}</div>
        </section>

        <section className="job-card" aria-labelledby="about">
          <h3 id="about">About the role</h3>
          <p className="muted" style={{ whiteSpace: "pre-wrap" }}>
            {job.description}
          </p>
        </section>

        <div className="job-actions">
          <a className="btn primary" href={job.applyUrl} target="_blank" rel="noreferrer">
            Apply on Source Site
          </a>
          <button className="btn" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save job"}
          </button>
        </div>

        <p className="muted" style={{ marginTop: 12 }}>
          Job ID: {job.id || "—"} • Source: {job.source || "Adzuna"}
        </p>
      </div>
    </div>
  );
}
