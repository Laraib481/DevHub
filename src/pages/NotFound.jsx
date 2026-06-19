import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="notfound-buttons">
          <Link to="/" className="notfound-primary-btn">
            Go Home
          </Link>

          <Link to="/dashboard" className="notfound-secondary-btn">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;