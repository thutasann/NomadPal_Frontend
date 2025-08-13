// src/pages/CityDetail.jsx
import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCities } from "../hooks/useCities";
import { toast } from "react-hot-toast";

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
  const { currentCity, loadCityBySlug, isLoading, error } = useCities();
  
  // Local state for the specific city
  const [city, setCity] = useState(null);
  const [localIsLoading, setLocalIsLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  // Jobs state: search + pagination + scroll
  const pageSize = 5;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Saved jobs state
  const [savedIds, setSavedIds] = useState(() => loadSaved());

  // Load city data when component mounts or slug changes
  useEffect(() => {
    const loadCityData = async () => {
      try {
        setLocalIsLoading(true);
        setLocalError(null);
        
        // Use the dedicated function to load city by slug
        const cityData = await loadCityBySlug(slug);
        setCity(cityData);
        
      } catch (err) {
        console.error('Error loading city:', err);
        setLocalError('Failed to load city data');
      } finally {
        setLocalIsLoading(false);
      }
    };

    if (slug) {
      loadCityData();
    }
  }, [slug, loadCityBySlug]);

  // Save saved jobs to localStorage
  useEffect(() => saveSaved(savedIds), [savedIds]);

  // For now, we'll use empty jobs array since we don't have job data yet
  const cityJobs = [];
  
  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cityJobs;
    return cityJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.pay.toLowerCase().includes(q)
    );
  }, [query, cityJobs]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const sliceStart = (currentPage - 1) * pageSize;
  const pageJobs = filteredJobs.slice(sliceStart, sliceStart + pageSize);

  function onSearch(e) {
    setQuery(e.target.value);
    setPage(1);
  }

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

  // Show loading state
  if (localIsLoading || isLoading) {
    return (
      <div className="city-bg">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div>Loading city data...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (localError || error || !city) {
    return (
      <div className="city-bg">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>City Not Found</h2>
            <p className="muted">{localError || error || 'The requested city could not be found.'}</p>
            <button className="btn" onClick={() => navigate('/cities')}>
              Back to Cities
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare city data for display
  const cityStats = [
    { label: "Monthly Cost of Living", value: city.monthly_cost_usd ? `$${city.monthly_cost_usd.toLocaleString()}` : 'N/A' },
    { label: "Avg Pay Rate", value: city.avg_pay_rate_usd_hour ? `$${city.avg_pay_rate_usd_hour}/hr` : 'N/A' },
    { label: "Weather", value: city.weather_avg_temp_c ? `${city.weather_avg_temp_c}°C avg` : 'N/A' },
    { label: "Safety", value: city.safety_score ? `${city.safety_score}/100` : 'N/A' },
    { label: "Nightlife", value: city.nightlife_rating ? `${city.nightlife_rating}/10` : 'N/A' },
    { label: "Transport", value: city.transport_rating ? `${city.transport_rating}/10` : 'N/A' },
  ];

  const housing = [
    { label: "Studio", value: city.housing_studio_usd_month ? `$${city.housing_studio_usd_month}/mo` : 'N/A' },
    { label: "1-Bed", value: city.housing_one_bed_usd_month ? `$${city.housing_one_bed_usd_month}/mo` : 'N/A' },
    { label: "Co-living", value: city.housing_coliving_usd_month ? `$${city.housing_coliving_usd_month}/mo` : 'N/A' },
  ];

  const climate = [
    { label: "Avg Temp", value: city.climate_avg_temp_c ? `${city.climate_avg_temp_c}°C` : 'N/A' },
    { label: "Summary", value: city.climate_summary || 'N/A' },
    { label: "Internet Speed", value: city.internet_speed || 'N/A' },
  ];

  const costBreakdown = [
    { label: "Rent", value: city.cost_pct_rent ? `${city.cost_pct_rent}%` : 'N/A' },
    { label: "Dining", value: city.cost_pct_dining ? `${city.cost_pct_dining}%` : 'N/A' },
    { label: "Transport", value: city.cost_pct_transport ? `${city.cost_pct_transport}%` : 'N/A' },
    { label: "Groceries", value: city.cost_pct_groceries ? `${city.cost_pct_groceries}%` : 'N/A' },
    { label: "Coworking", value: city.cost_pct_coworking ? `${city.cost_pct_coworking}%` : 'N/A' },
    { label: "Other", value: city.cost_pct_other ? `${city.cost_pct_other}%` : 'N/A' },
  ];

  const travelCosts = [
    { value: city.travel_flight_from_usd ? `From $${city.travel_flight_from_usd}` : 'N/A', hint: "Flight Price" },
    { value: city.travel_local_transport_usd_week ? `$${city.travel_local_transport_usd_week}` : 'N/A', hint: "Local Transport (1W)" },
    { value: city.travel_hotel_usd_week ? `$${city.travel_hotel_usd_week}` : 'N/A', hint: "Hotel (1W)" },
  ];

  // Parse lifestyle tags if they exist
  const lifestyleTags = city.lifestyle_tags ? 
    (typeof city.lifestyle_tags === 'string' ? JSON.parse(city.lifestyle_tags) : city.lifestyle_tags) : 
    [];

  return (
    <div className="city-bg">
      {/* HERO */}
      <header className="city-hero">
        <div className="container">
          <h1 className="city-title">{city.name}, {city.country}</h1>
          <p className="city-sub">
            {city.description || `${city.name} offers a great destination for digital nomads.`}
          </p>
        </div>
      </header>

      <div className="container city-wrap">
        {/* Quick stats */}
        <div className="city-stats">
          {cityStats.map((s, i) => (
            <div key={i} className="city-stat">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Visa */}
        <Card title="Visa Requirement for US Passport">
          <p className="muted">🪪 {city.visa_requirement || 'Information not available'}</p>
        </Card>

        {/* Two-column sections */}
        <div className="grid-2">
          <Card title="Housing Costs">
            <ul className="bullet">
              {housing.map((h, i) => (
                <li key={i}>
                  <span className="muted">{h.label}:</span> {h.value}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Weather & Climate">
            <ul className="bullet">
              {climate.map((c, i) => (
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
              <li>Transport Rating: {city.transport_rating || 'N/A'}/10</li>
              <li>Currency: {city.currency || 'USD'}</li>
            </ul>
          </Card>

          <Card title="Lifestyle">
            <ul className="bullet">
              {lifestyleTags.length > 0 ? (
                lifestyleTags.map((tag, i) => (
                  <li key={i}>{tag}</li>
                ))
              ) : (
                <li>Lifestyle information not available</li>
              )}
            </ul>
          </Card>
        </div>

        {/* Cost breakdown */}
        <Card title="Cost Breakdown">
          <div className="tags">
            {costBreakdown.map((c, i) => (
              <span className="tag" key={i}>
                {c.label} — {c.value}
              </span>
            ))}
          </div>
        </Card>

        {/* Travel cost */}
        <Card title="Estimated Travel Cost per Person">
          <div className="travel-cards">
            {travelCosts.map((t, i) => (
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
            {pageJobs.length > 0 ? (
              pageJobs.map((job) => (
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
              ))
            ) : (
              <div className="muted" style={{ padding: 12 }}>
                {cityJobs.length === 0 ? 'No job listings available for this city yet.' : 'No jobs match your search.'}
              </div>
            )}
          </div>

          {/* Pagination controls (outside the scroll area) */}
          {cityJobs.length > 0 && (
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
          )}
        </Card>
      </div>
    </div>
  );
}
