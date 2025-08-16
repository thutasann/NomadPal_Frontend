import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isAuthenticated, user, actions } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    actions.logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="container">
        <Link className="brand" to="/">NomadPal</Link>
        <nav className="nav-links">
          <Link to="/cities">Cities</Link>
          {isAuthenticated ? (
            <>
              <Link to="/saved-cities">Saved Cities</Link>
              <Link to="/profile">Profile</Link>
              <button 
                className="btn small ghost" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link className="btn small" to="/register">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
  