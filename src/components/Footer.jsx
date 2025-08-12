export default function Footer() {
    return (
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} NomadPal • Built for remote folks</p>
          <nav className="footer-nav">
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </footer>
    );
  }
  