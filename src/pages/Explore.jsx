import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function Explore() {
  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersWithCounts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users");
        const users = await response.json();

        if (!response.ok) {
          alert(users.message || "Failed to load users");
          setLoading(false);
          return;
        }

        const usersWithCounts = await Promise.all(
          users.map(async (user) => {
            try {
              const [snippetResponse, noteResponse, resourceResponse] =
                await Promise.all([
                  fetch(`http://localhost:5000/api/snippets/public/${user._id}`),
                  fetch(`http://localhost:5000/api/notes/public/${user._id}`),
                  fetch(`http://localhost:5000/api/resources/public/${user._id}`),
                ]);

              const snippets = await snippetResponse.json();
              const notes = await noteResponse.json();
              const resources = await resourceResponse.json();

              return {
                ...user,
                publicSnippetCount: snippetResponse.ok ? snippets.length : 0,
                publicNoteCount: noteResponse.ok ? notes.length : 0,
                publicResourceCount: resourceResponse.ok ? resources.length : 0,
              };
            } catch (error) {
              return {
                ...user,
                publicSnippetCount: 0,
                publicNoteCount: 0,
                publicResourceCount: 0,
              };
            }
          })
        );

        setDevelopers(usersWithCounts);
      } catch (error) {
        console.log(error);
        alert("Server error while loading users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithCounts();
  }, []);

  const filteredDevelopers = developers.filter((developer) => {
    const searchableText = `
      ${developer.fullName || ""}
      ${developer.username || ""}
      ${developer.role || ""}
      ${developer.bio || ""}
      ${(developer.skills || []).join(" ")}
    `.toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout
      title="Explore Developers"
      subtitle="Discover real user profiles and their public showcase."
    >
      <div className="explore-toolbar">
        <input
          type="text"
          placeholder="Search developers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="dashboard-empty-text">Loading users...</p>
      ) : (
        <div className="explore-grid">
          {filteredDevelopers.length === 0 ? (
            <p className="dashboard-empty-text">No matching profiles found.</p>
          ) : (
            filteredDevelopers.map((developer) => (
              <div className="developer-card" key={developer._id}>
                <div className="developer-top">
                  <div className="developer-avatar">
                    {(developer.fullName || "D").charAt(0).toUpperCase()}
                  </div>

                  <div className="developer-info">
                    <h3>{developer.fullName || "Developer"}</h3>
                    <h4>{developer.username || "@user"}</h4>
                    <p className="developer-role">
                      {developer.role || "Developer"}
                    </p>
                  </div>
                </div>

                <p className="developer-bio">
                  {developer.bio || "No bio added yet."}
                </p>

                <div className="developer-tags">
                  {developer.skills?.length > 0 ? (
                    developer.skills.map((skill, index) => (
                      <span key={index}>{skill}</span>
                    ))
                  ) : (
                    <span>No skills added</span>
                  )}
                </div>

                <div className="developer-stats">
                  <div>
                    <strong>{developer.publicNoteCount || 0}</strong>
                    <span>Public Notes</span>
                  </div>

                  <div>
                    <strong>{developer.publicSnippetCount || 0}</strong>
                    <span>Public Snippets</span>
                  </div>

                  <div>
                    <strong>{developer.publicResourceCount || 0}</strong>
                    <span>Resources</span>
                  </div>

                  <div>
                    <strong>{developer.skills?.length || 0}</strong>
                    <span>Skills</span>
                  </div>
                </div>

                <Link
                  to={`/developer/${developer._id}`}
                  className="view-profile-btn"
                >
                  View Profile
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Explore;