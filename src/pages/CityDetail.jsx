// src/pages/CityDetail.jsx
import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ---------- mock data (swap with API later) ---------- */
const CITY_DATA = {
  lisbon: {
    name: "Lisbon, Portugal",
    blurb:
      "Lisbon offers 100 Mbps internet, safety score 75, and affordable living at $1,500/month for nomads.",
    stats: [
      { label: "Monthly Cost of Living", value: "$1,500" },
      { label: "Avg Pay Rate", value: "$25/hr" },
      { label: "Weather", value: "17°C avg" },
      { label: "Safety", value: "75/100" },
      { label: "Nightlife", value: "8/10" },
      { label: "Transport", value: "7/10" },
    ],
    visa: "Visa-free: 90 days within 180 days (Schengen rules apply)",
    housing: [
      { label: "Studio", value: "$900/mo" },
      { label: "1-Bed", value: "$1,200/mo" },
      { label: "Co-living", value: "$600/mo" },
    ],
    climate: [
      { label: "Avg Temp", value: "17°C" },
      { label: "Summary", value: "Mild & sunny" },
      { label: "Sunshine hours/year", value: "2,800" },
    ],
    transport: ["Metro, trams, good walkability", "Airport: 15 min away"],
    lifestyle: [
      "High safety",
      "Vibrant nightlife",
      "Large expat community",
      "Nature accessible",
    ],
    costBreakdown: [
      { label: "Rent", value: "45%" },
      { label: "Dining", value: "15%" },
      { label: "Transport", value: "7%" },
      { label: "Groceries", value: "20%" },
      { label: "Coworking", value: "8%" },
      { label: "Other", value: "5%" },
    ],
    travelCosts: [
      { value: "From $320", hint: "Flight Price" },
      { value: "$25", hint: "Local Transport (1W)" },
      { value: "$420", hint: "Hotel (1W)" },
    ],
    jobs: [
      {
        id: 1,
        title: "Frontend Developer — Remote (Portugal timezone)",
        company: "LisbonTech",
        pay: "USD 45–55k/year",
        applyUrl: "https://example.com/jobs/1",
      },
      {
        id: 2,
        title: "Content Marketing Specialist — Remote",
        company: "NomadWorks",
        pay: "USD 25–35/hr",
        applyUrl: "https://example.com/jobs/2",
      },
      {
        id: 3,
        title: "DevOps Engineer — Hybrid Lisbon",
        company: "CloudConnect",
        pay: "USD 60–75k/year",
        applyUrl: "https://example.com/jobs/3",
      },
      { id: 4, title: "Product Designer — Remote EU", company: "Dsgnly", pay: "USD 45–70k/year", applyUrl: "#" },
      { id: 5, title: "QA Automation Engineer", company: "TestFlow", pay: "USD 35–55k/year", applyUrl: "#" },
      { id: 6, title: "Data Analyst (SQL/Python)", company: "DataSea", pay: "USD 30–45/hr", applyUrl: "#" },
      { id: 7, title: "Mobile Engineer — React Native", company: "Pocket App", pay: "USD 60–90k/year", applyUrl: "#" },
      { id: 8, title: "Customer Success Manager", company: "SaaSly", pay: "USD 40–55k/year", applyUrl: "#" },
      { id: 9, title: "SRE — Remote EU", company: "InfraLab", pay: "USD 80–110k/year", applyUrl: "#" },
      { id: 10, title: "Support Engineer — Remote", company: "Helply", pay: "USD 25–35/hr", applyUrl: "#" },
    ],
  },
};

/* ---------- small card wrapper ---------- */
function Card({ title, children }) {
  return (
    <section className="city-card">
      {title && <h3 className="city-card-title">{title}</h3>}
      <div className="city-card-body">{children}</div>
    </section>
  );
}

/* ---------- helpers: saved jobs in localStorage ---------- */
const SAVED_KEY = "np_saved_jobs";
function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveSaved(list) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(list));
}

export default function CityDetail() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();

  // Resolve city data from slug like /cities/lisbon or /cities/lisbon-portugal
  const city = useMemo(() => {
    const key = slug.toLowerCase();
    if (CITY_DATA[key]) return CITY_DATA[key];
    const base = key.split("-")[0];
    return CITY_DATA[base] || CITY_DATA.lisbon;
  }, [slug]);

  /* ---------------- Jobs state: search + pagination + scroll ---------------- */
  const pageSize = 5;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return city.jobs;
    return city.jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.pay.toLowerCase().includes(q)
    );
  }, [query, city.jobs]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const sliceStart = (currentPage - 1) * pageSize;
  const pageJobs = filteredJobs.slice(sliceStart, sliceStart + pageSize);

  function onSearch(e) {
    setQuery(e.target.value);
    setPage(1);
  }

  /* ---------------- Saved jobs ---------------- */
  const [savedIds, setSavedIds] = useState(() => loadSaved());
  useEffect(() => saveSaved(savedIds), [savedIds]);

  const isSaved = (id) => savedIds.includes(id);
  const toggleSave = (id) =>
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  /* ---------------- Navigation to job detail ---------------- */
  function openJob(job) {
    // Navigate to /jobs/:id and pass job data in state (easy to replace with Adzuna later)
    navigate(`/jobs/${job.id}`, {
      state: {
        job,
        city: city.name,
        source: "city-detail",
      },
    });
  }

  return (
    <div className="city-bg">
      {/* HERO */}
      <header className="city-hero">
        <div className="container">
          <h1 className="city-title">{city.name}</h1>
          <p className="city-sub">{city.blurb}</p>
        </div>
      </header>

      <div className="container city-wrap">
        {/* Quick stats */}
        <div className="city-stats">
          {city.stats.map((s, i) => (
            <div key={i} className="city-stat">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Visa */}
        <Card title="Visa Requirement for US Passport">
          <p className="muted">🪪 {city.visa}</p>
        </Card>

        {/* Two-column sections */}
        <div className="grid-2">
          <Card title="Housing Costs">
            <ul className="bullet">
              {city.housing.map((h, i) => (
                <li key={i}>
                  <span className="muted">{h.label}:</span> {h.value}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Weather & Climate">
            <ul className="bullet">
              {city.climate.map((c, i) => (
                <li key={i}>
                  <span className="muted">{c.label}:</span> {c.value}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid-2">
          <Card title="Transportation">
            <ul className="bullet">
              {city.transport.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </Card>

          <Card title="Lifestyle">
            <ul className="bullet">
              {city.lifestyle.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Cost breakdown */}
        <Card title="Cost Breakdown">
          <div className="tags">
            {city.costBreakdown.map((c, i) => (
              <span className="tag" key={i}>
                {c.label} — {c.value}
              </span>
            ))}
          </div>
        </Card>

        {/* Travel cost */}
        <Card title="Estimated Travel Cost per Person">
          <div className="travel-cards">
            {city.travelCosts.map((t, i) => (
              <div className="travel-box" key={i}>
                <div className="travel-value">{t.value}</div>
                <div className="travel-hint">{t.hint}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Jobs (scrollable + pagination) */}
        <Card title="Popular Job Listings">
          <div className="job-search">
            <input
              placeholder="Search jobs..."
              value={query}
              onChange={onSearch}
              aria-label="Search jobs"
            />
          </div>

          {/* Only this area scrolls */}
          <div className="job-list-scroll" role="region" aria-label="Job results">
            {pageJobs.map((job) => (
              <div
                key={job.id}
                className="job-row"
                onClick={() => openJob(job)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openJob(job)}
                title="Open job details"
              >
                <div className="job-main">
                  <div className="job-title">{job.title}</div>
                  <div className="muted">
                    {job.company} • {job.pay}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {/* Apply — stop the row click */}
                  <button
                    className="btn small"
                    style={{
                      background: "#6C63FF",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "none",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const href = job.applyUrl || "#";
                      if (href && href !== "#") window.open(href, "_blank");
                    }}
                  >
                    Apply
                  </button>

                  {/* Save — stop the row click */}
                  <button
                    className="btn small"
                    style={{
                      background: isSaved(job.id) ? "#E1E7FF" : "#E5E7EB",
                      color: "#111",
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "none",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(job.id);
                    }}
                    aria-pressed={isSaved(job.id)}
                  >
                    {isSaved(job.id) ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            ))}

            {pageJobs.length === 0 && (
              <div className="muted" style={{ padding: 12 }}>
                No jobs match your search.
              </div>
            )}
          </div>

          {/* Pagination controls (outside the scroll area) */}
          <div className="jobs-pagination">
            <button
              className="btn"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </button>

            <span className="page-indicator">
              Page {currentPage} / {totalPages}
            </span>

            <button
              className="btn"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
