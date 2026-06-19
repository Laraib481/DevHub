import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

// Breakpoint (in px) below which the sidebar collapses into a slide-in drawer.
// At or above this width the sidebar is permanently visible (tablet/desktop).
const DRAWER_BREAKPOINT = 900;

function DashboardLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  // Controls the mobile drawer. Only relevant at <= DRAWER_BREAKPOINT.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  // Keep the drawer from getting "stuck" open when the viewport grows back to
  // desktop size (e.g. rotating a tablet or resizing the window).
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > DRAWER_BREAKPOINT) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Allow closing the drawer with the Escape key, and lock background scroll
  // while it is open so the page behind the overlay doesn't move.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    // Clear the authentication session and return to login.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      {/* Mobile-only top bar with the hamburger toggle (hidden on desktop). */}
      <div className="app-mobile-topbar">
        <button
          type="button"
          className="app-hamburger-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <FiMenu />
        </button>
        <div className="app-mobile-logo">DevHub</div>
      </div>

      {/* Dim overlay behind the open drawer; clicking it closes the sidebar. */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
        <div className="app-sidebar-head">
          {/* <div className="app-sidebar-logo">DevHub</div> */}
<div className="app-sidebar-logo">
  <div className="logo-mark">DH</div>
  <span>DevHub</span>
</div>
          <button
            type="button"
            className="app-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
          >
            <FiX />
          </button>
        </div>
      
        <nav className="app-sidebar-nav">
          <Link to="/dashboard" onClick={closeSidebar}>
            Dashboard
          </Link>
          <Link to="/profile" onClick={closeSidebar}>
            My Profile
          </Link>
          <Link to="/snippets" onClick={closeSidebar}>
            Snippets
          </Link>
          <Link to="/notes" onClick={closeSidebar}>
            Notes
          </Link>
          <Link to="/resources" onClick={closeSidebar}>
            Resources
          </Link>
          <Link to="/explore" onClick={closeSidebar}>
            Explore
          </Link>
        
          <button
            type="button"
            className="app-sidebar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

     

      <main className="app-main-content">
        <header className="app-page-header">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </header>

        <div className="app-page-body">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
