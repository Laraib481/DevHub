import { Navigate } from "react-router-dom";

// Guards private routes: if there is no auth token in localStorage,
// the user is not authenticated and is redirected to the login page.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
