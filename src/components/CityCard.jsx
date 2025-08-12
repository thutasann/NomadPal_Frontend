
export default function CityCard({ city }) {
    return (
      <article className="card">
        <header className="card-head">
          <h3>{city.name}</h3>
          <span className="country">{city.country}</span>
        </header>
  
        <div className="badges">
          <Badge label="Score" value={city.score} />
          <Badge label="Cost" value={`$${city.cost}`} />
          <Badge label="Internet" value={`${city.internet} Mbps`} />
          <Badge label="Safety" value={city.safety} />
          <Badge label="Climate" value={city.climate} />
        </div>
  
        <div className="card-actions">
          <a className="btn" href="cities/:slug">Details</a>
          <a className="btn primary" href="#">Save</a>
        </div>
      </article>
    );
  }
  
  function Badge({ label, value }) {
    return (
      <div className="badge">
        <span className="badge-label">{label}</span>
        <span className="badge-value">{value}</span>
      </div>
    );
  }
  