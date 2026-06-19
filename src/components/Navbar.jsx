import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">DevHub</div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup" className="nav-signup-btn">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;