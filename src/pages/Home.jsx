// src/pages/Home.jsx
import { Link } from "react-router-dom";
import beach from "../assets/home_bg.jpg";

export default function Home() {
  return (
    <>
      {/* Hero with background + overlay */}
      <section
        className="hero hero-with-bg"
        style={{ backgroundImage: `url(${beach})` }}
      >
        <div className="container">
          <h1>NomadPal</h1>
          <p className="subtitle">
            Find the best cities for remote work - compare cost, internet, safety,
            and climate.
          </p>

          <div className="hero-actions">
            <Link className="btn primary" to="/cities">
              Explore Cities
            </Link>
            <a className="btn" href="#how-it-works">
              How it works
            </a>
          </div>

          <div className="hero-stats">
            <div><span>120+</span><span>Cities ranked</span></div>
            <div><span>10k+</span><span>Jobs scanned</span></div>
            <div><span>24/7</span><span>Fresh data</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="features container">
        <Feature
          title="Smart City Scores"
          text="We blend cost of living, internet speed, safety, and weather into one easy score."
        />
        <Feature
          title="Remote Jobs"
          text="Search curated remote roles and see which cities match your salary and lifestyle."
        />
        <Feature
          title="Travel Aware"
          text="Estimate flight costs and seasonality before you book."
        />
      </section>

      {/* CTA */}
      <section id="explore" className="cta">
        <div className="container">
          <h2>Start exploring your next base</h2>
          <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Job title (e.g., Frontend Developer)" />
            <input placeholder="Monthly budget (USD)" />
            <button className="btn primary" type="submit">
              Find my cities
            </button>
          </form>
          <p className="hint">No signup needed to try it.</p>
        </div>
      </section>
    </>
  );
}

function Feature({ title, text }) {
  return (
    <div className="feature">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
