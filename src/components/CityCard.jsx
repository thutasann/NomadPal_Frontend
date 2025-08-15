import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { toast } from "react-hot-toast";

export default function CityCard({ city }) {
  const { isAuthenticated } = useAuth();
  const { user, saveCity, removeCity } = useUser();
  
  // Check if city is saved by looking at user's saved cities
  const isSaved = user?.saved_cities?.some(savedCity => savedCity.id === city.id) || false;

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save cities');
      return;
    }

    try {
      if (isSaved) {
        await removeCity(city.id);
        toast.success(`${city.name} removed from saved cities`);
      } else {
        await saveCity(city.id);
        toast.success(`${city.name} saved to your list`);
      }
    } catch (error) {
      toast.error('Failed to update saved cities');
    }
  };

  // Calculate a score based on available data
  const calculateScore = () => {
    // If we have ML prediction score, use it (scaled to 0-100)
    if (city.predicted_score && city.ml_enhanced) {
      // Convert ML score to percentage (assuming ML score is between 0-1 or similar)
      const mlScore = parseFloat(city.predicted_score);
      if (mlScore > 1) {
        return Math.round(Math.min(mlScore, 100)); // If already in 0-100 range
      } else {
        return Math.round(mlScore * 100); // If in 0-1 range, scale to 0-100
      }
    }
    
    // Fallback to manual calculation if no ML score
    let score = 0;
    let factors = 0;
    
    // Safety score (0-100)
    if (city.safety_score) {
      const safetyScore = parseFloat(city.safety_score);
      score += safetyScore;
      factors++;
    }
    
    // Transport rating (scale 0-5 to 0-100)
    if (city.transport_rating) {
      const transportScore = parseFloat(city.transport_rating) * 20; // Scale to 0-100
      score += transportScore;
      factors++;
    }
    
    // Nightlife rating (scale 0-5 to 0-100)
    if (city.nightlife_rating) {
      const nightlifeScore = parseFloat(city.nightlife_rating) * 20; // Scale to 0-100
      score += nightlifeScore;
      factors++;
    }
    
    // Cost efficiency (lower cost = higher score)
    if (city.monthly_cost_usd) {
      const monthlyCost = parseFloat(city.monthly_cost_usd);
      // Assume $3000 is max reasonable cost, give higher score for lower cost
      const costScore = Math.max(0, 100 - (monthlyCost / 30)); // Rough scoring
      score += costScore;
      factors++;
    }
    
    return factors > 0 ? Math.round(score / factors) : 0;
  };

  return (
    <article className="card">
      <header className="card-head">
        <h3>{city.name} {city.ml_enhanced && <span className="ml-badge" title="ML Enhanced">🤖</span>}</h3>
        <span className="country">{city.country}</span>
      </header>

      <div className="badges">
        <Badge label="Score" value={calculateScore()} />
        <Badge label="Cost" value={city.monthly_cost_usd ? `$${parseFloat(city.monthly_cost_usd).toLocaleString()}` : 'N/A'} />
        <Badge label="Internet" value={city.internet_speed || 'N/A'} />
        <Badge label="Safety" value={city.safety_score ? Math.round(parseFloat(city.safety_score)) : 'N/A'} />
        <Badge label="Climate" value={city.climate_summary || 'N/A'} />
      </div>

      <div className="card-actions">
        <Link className="btn" to={`/cities/${city.slug || city.id}`}>
          Details
        </Link>
        <button 
          className={`btn ${isSaved ? 'ghost' : 'primary'}`}
          onClick={handleSaveToggle}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
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
  