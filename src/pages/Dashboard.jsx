import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [snippets, setSnippets] = useState([]);
  const [notes, setNotes] = useState([]);
  const [resources, setResources] = useState([]);

  // Load the authenticated user's own snippets, notes, and resources
  // from the backend so each user only sees their own dashboard data.
  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (!currentUser?.id) return;

      try {
        const [snippetRes, noteRes, resourceRes] = await Promise.all([
          fetch(`http://localhost:5000/api/snippets/user/${currentUser.id}`),
          fetch(`http://localhost:5000/api/notes/user/${currentUser.id}`),
          fetch(`http://localhost:5000/api/resources/user/${currentUser.id}`),
        ]);

        const snippetData = await snippetRes.json();
        const noteData = await noteRes.json();
        const resourceData = await resourceRes.json();

        if (snippetRes.ok) setSnippets(snippetData);
        if (noteRes.ok) setNotes(noteData);
        if (resourceRes.ok) setResources(resourceData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboardData();
  }, []);

  const fullName = loggedInUser?.fullName || "Developer";

  const firstName = fullName.split(" ")[0];

 
  const publicSnippets = snippets.filter(
    (snippet) => snippet.visibility === "Public"
  );

  const privateNotes = notes.filter(
    (note) => note.visibility === "Private"
  );

  const publicResources = resources.filter(
    (resource) => resource.visibility === "Public"
  );

  const recentActivity = [
    ...snippets.map((item) => ({
      id: item._id,
      type: "Snippet",
      title: item.title,
      createdAt: item.createdAt,
    })),
    ...notes.map((item) => ({
      id: item._id,
      type: "Note",
      title: item.title,
      createdAt: item.createdAt,
    })),
    ...resources.map((item) => ({
      id: item._id,
      type: "Resource",
      title: item.title,
      createdAt: item.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const stats = [
    { title: "Total Snippets", value: snippets.length },
    { title: "Private Notes", value: privateNotes.length },
    { title: "Public Resources", value: publicResources.length },
    { title: "Public Snippets", value: publicSnippets.length },
  ];

  return (
    <DashboardLayout
      title={`Welcome back, ${firstName} 👋` } 

      subtitle="Here’s a real overview of your developer workspace."
    >
      
      <section className="dashboard-hero-card">
         

        <div>
          <h2>Build smarter, organize better</h2>
          <p>
            Manage your snippets, notes, and resources from one clean and
            powerful dashboard with real saved data.
          </p>
        </div>

        <Link to="/add-snippet" className="dashboard-primary-btn">
          Create New
        </Link>
      </section>

      <section className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <p>{item.title}</p>
            <h3>{item.value}</h3>
          </div>
        ))}
      </section>

      <section className="dashboard-lower-grid">
        <div className="quick-actions-card">
          <h3>Quick Actions</h3>

          <div className="quick-actions-grid">
            <Link to="/add-snippet" className="quick-action-link">
              Add Snippet
            </Link>

            <Link to="/add-note" className="quick-action-link">
              Add Note
            </Link>

            <Link to="/add-resource" className="quick-action-link">
              Add Resource
            </Link>

            <Link to="/edit-profile" className="quick-action-link">
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="recent-activity-card">
          <h3>Recent Activity</h3>

          {recentActivity.length === 0 ? (
            <p className="dashboard-empty-text">
              No activity yet. Start by adding a snippet, note, or resource.
            </p>
          ) : (
            <ul>
              {recentActivity.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <strong>{item.type}:</strong> {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;