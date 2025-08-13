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
    let score = 0;
    let factors = 0;
    
    if (city.safety_score) {
      score += city.safety_score;
      factors++;
    }
    
    if (city.transport_rating) {
      score += city.transport_rating * 10;
      factors++;
    }
    
    if (city.nightlife_rating) {
      score += city.nightlife_rating * 10;
      factors++;
    }
    
    return factors > 0 ? Math.round(score / factors) : 0;
  };

  return (
    <article className="card">
      <header className="card-head">
        <h3>{city.name}</h3>
        <span className="country">{city.country}</span>
      </header>

      <div className="badges">
        <Badge label="Score" value={calculateScore()} />
        <Badge label="Cost" value={`$${city.monthly_cost_usd?.toLocaleString() || 'N/A'}`} />
        <Badge label="Internet" value={city.internet_speed || 'N/A'} />
        <Badge label="Safety" value={city.safety_score || 'N/A'} />
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
  