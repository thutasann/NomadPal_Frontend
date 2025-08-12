
export default function Navbar() {
    return (
      <header className="nav">
        <div className="container">
          <a className="brand" href="/">NomadPal</a>
          <nav className="nav-links">
            <a href="#how-it-works">Explore</a>
            <a className="btn small" href="/login">Login</a>
          </nav>
        </div>
      </header>
    );
  }
  