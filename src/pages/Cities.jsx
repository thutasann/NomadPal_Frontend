// src/pages/Cities.jsx
import { useEffect, useMemo, useState } from "react";
import CityCard from "../components/CityCard";
import BudgetFilter from "../components/BudgetFilter"; 

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [q, setQ] = useState("");
  const [climate, setClimate] = useState("any");
  const [maxCost, setMaxCost] = useState(2500);
  const [sort, setSort] = useState("score-desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load from /public/api/cities.json if present; otherwise use fallback seed
    async function load() {
      try {
        const r = await fetch("/api/cities.json");
        if (r.ok) {
          const data = await r.json();
          setCities(data);
        } else {
          setCities(SEED);
        }
      } catch {
        setCities(SEED);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = cities.filter(c =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.country.toLowerCase().includes(q.toLowerCase())
    );
    if (climate !== "any") list = list.filter(c => c.climate === climate);
    list = list.filter(c => c.cost <= maxCost);

    const by = {
      "score-desc": (a, b) => b.score - a.score,
      "cost-asc": (a, b) => a.cost - b.cost,
      "internet-desc": (a, b) => b.internet - a.internet,
      "safety-desc": (a, b) => b.safety - a.safety,
    }[sort];

    return [...list].sort(by);
  }, [cities, q, climate, maxCost, sort]);

  return (
    <div className="cities-bg">
      <div className="container">
        <header className="page-head">
          <h1>Cities</h1>
          <p className="subtitle">Compare cost, internet, safety, and climate.</p>
        </header>

        {/* Toolbar */}
        <div className="toolbar">
  <input
    className="input"
    placeholder="Search city or country…"
    value={q}
    onChange={(e) => setQ(e.target.value)}
  />

  <BudgetFilter value={maxCost} onChange={(v) => setMaxCost(v)} />

  <select className="input" value={climate} onChange={(e) => setClimate(e.target.value)}>
    <option value="any">Any climate</option>
    <option value="warm">Warm</option>
    <option value="mild">Mild</option>
    <option value="cool">Cool</option>
  </select>

  <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
    <option value="score-desc">Top score</option>
    <option value="cost-asc">Lowest cost</option>
    <option value="internet-desc">Fastest internet</option>
    <option value="safety-desc">Safest</option>
  </select>
</div>
        {/* Results */}
        {loading ? (
          <p className="muted">Loading cities…</p>
        ) : filtered.length === 0 ? (
          <p className="muted">No cities match your filters.</p>
        ) : (
          <div className="grid">
            {filtered.map((c) => (
              <CityCard key={c.id} city={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Fallback seed data
const SEED = [
  { id: 1, name: "Lisbon", country: "Portugal", cost: 1800, internet: 120, safety: 78, climate: "mild", score: 88 },
  { id: 2, name: "Chiang Mai", country: "Thailand", cost: 1000, internet: 90, safety: 70, climate: "warm", score: 86 },
  { id: 3, name: "Mexico City", country: "Mexico", cost: 1500, internet: 80, safety: 60, climate: "mild", score: 79 },
  { id: 4, name: "Tallinn", country: "Estonia", cost: 1900, internet: 160, safety: 82, climate: "cool", score: 84 },
  { id: 5, name: "Bali (Canggu)", country: "Indonesia", cost: 1300, internet: 70, safety: 62, climate: "warm", score: 80 },
];
