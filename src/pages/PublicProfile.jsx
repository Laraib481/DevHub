import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import NoteCard from "../components/NoteCard";
import ReaderModal from "../components/ReaderModal";

// Adapt a snippet into the shape NoteCard/ReaderModal consume, so snippets
// render through the exact same preview-card + reader-modal system as notes.
// The code becomes a fenced block, which RichNoteContent highlights on expand.
function snippetToNote(snippet) {
  const description = snippet.description ? `${snippet.description}\n\n` : "";
  const code = `\`\`\`${snippet.language || ""}\n${snippet.code || ""}\n\`\`\``;

  return {
    _id: snippet._id,
    title: snippet.title,
    category: snippet.language || "Code",
    visibility: snippet.visibility,
    tags: snippet.tags,
    content: `${description}${code}`,
  };
}

function PublicProfile() {
  const { id } = useParams();

  const [developer, setDeveloper] = useState(null);
  const [publicSnippets, setPublicSnippets] = useState([]);
  const [publicNotes, setPublicNotes] = useState([]);
  const [publicResources, setPublicResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    const fetchProfileAndContent = async () => {
      try {
        const userResponse = await fetch("http://localhost:5000/api/auth/users");
        const users = await userResponse.json();

        if (!userResponse.ok) {
          setLoading(false);
          return;
        }

        const foundUser = users.find((user) => user._id === id);

        if (!foundUser) {
          setDeveloper(null);
          setLoading(false);
          return;
        }

        setDeveloper(foundUser);

        const [snippetResponse, noteResponse, resourceResponse] =
          await Promise.all([
            fetch(`http://localhost:5000/api/snippets/public/${id}`),
            fetch(`http://localhost:5000/api/notes/public/${id}`),
            fetch(`http://localhost:5000/api/resources/public/${id}`),
          ]);

        const snippetData = await snippetResponse.json();
        const noteData = await noteResponse.json();
        const resourceData = await resourceResponse.json();

        if (snippetResponse.ok) setPublicSnippets(snippetData);
        if (noteResponse.ok) setPublicNotes(noteData);
        if (resourceResponse.ok) setPublicResources(resourceData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndContent();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout
        title="Loading Profile"
        subtitle="Please wait while the profile loads."
      >
        <p className="dashboard-empty-text">Loading profile...</p>
      </DashboardLayout>
    );
  }

  if (!developer) {
    return (
      <DashboardLayout
        title="Developer Not Found"
        subtitle="The profile you are looking for does not exist."
      >
        <p className="dashboard-empty-text">Developer profile not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={developer.fullName || "Developer"}
      subtitle="Explore this developer’s public profile and shared content."
    >
      <div className="profile-top-card">
        <div className="profile-left">
          <div className="profile-avatar">
            {(developer.fullName || "D").charAt(0).toUpperCase()}
          </div>

          <div className="profile-info">
            <h1>{developer.fullName || "Developer"}</h1>
            <h3>{developer.username || "@user"}</h3>
            <p className="profile-role">{developer.role || "Developer"}</p>
            <p className="profile-bio">{developer.bio || "No bio added yet."}</p>
          </div>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <p>Public Notes</p>
          <h2>{publicNotes.length}</h2>
        </div>

        <div className="profile-stat-card">
          <p>Public Snippets</p>
          <h2>{publicSnippets.length}</h2>
        </div>

        <div className="profile-stat-card">
          <p>Public Resources</p>
          <h2>{publicResources.length}</h2>
        </div>

        <div className="profile-stat-card">
          <p>Skills</p>
          <h2>{developer.skills?.length || 0}</h2>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-section-card">
          <h3>Skills</h3>
          <div className="profile-tags">
            {developer.skills?.length > 0 ? (
              developer.skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))
            ) : (
              <span>No skills added</span>
            )}
          </div>
        </div>

        <div className="profile-section-card">
          <h3>About</h3>
          <p>{developer.about || "No about section added yet."}</p>
        </div>

        <div className="profile-section-card">
          <h3>Public Notes</h3>
          {publicNotes.length === 0 ? (
            <p>No public notes available.</p>
          ) : (
            <div className="notes-grid-v2">
              {publicNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onOpen={(selected) => setActiveNote(selected)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="profile-section-card">
          <h3>Public Snippets</h3>
          {publicSnippets.length === 0 ? (
            <p>No public snippets available.</p>
          ) : (
            <div className="notes-grid-v2">
              {publicSnippets.map((snippet) => (
                <NoteCard
                  key={snippet._id}
                  note={snippetToNote(snippet)}
                  onOpen={(selected) => setActiveNote(selected)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="profile-section-card">
          <h3>Public Resources</h3>
          {publicResources.length === 0 ? (
            <p>No public resources available.</p>
          ) : (
            <div className="resources-grid">
              {publicResources.map((resource) => (
                <div className="resource-card" key={resource._id}>
                  <div className="resource-top">
                    <div>
                      <h3>{resource.title}</h3>
                      <p>{resource.category}</p>
                    </div>

                    <span className="resource-badge public-badge">
                      {resource.visibility}
                    </span>
                  </div>

                  <p className="resource-description">{resource.description}</p>

                  <div className="resource-link-box">
                    <span>Source:</span>
                    <p>{resource.link}</p>
                  </div>

                  <div className="resource-tags">
                    {resource.tags.map((tag, index) => (
                      <span key={index}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="public-profile-buttons">
        <Link to="/explore" className="public-profile-btn primary">
          Back to Explore
        </Link>

        <Link to="/dashboard" className="public-profile-btn secondary">
          Go to Dashboard
        </Link>
      </div>

      {activeNote && (
        <ReaderModal note={activeNote} onClose={() => setActiveNote(null)} />
      )}
    </DashboardLayout>
  );
}

export default PublicProfile;