import { toast } from "react-hot-toast";
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
        <a className="brand" href="/">NomadPal</a>
        <nav className="nav-links">
          <a href="/cities">Cities</a>
          {isAuthenticated ? (
            <>
              <a href="/profile">Profile</a>
              <button 
                className="btn small ghost" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a className="btn small" href="/register">Sign Up</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
  