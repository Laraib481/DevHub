import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import NoteCard from "../components/NoteCard";
import ReaderModal from "../components/ReaderModal";
import API from "../api";
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

function Profile() {
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const defaultProfile = {
    fullName: savedUser?.fullName || "Developer",
    username: savedUser?.username || "@user",
    role: savedUser?.role || "Developer",
    bio: savedUser?.bio || "",
    about: savedUser?.about || "",
    skills: savedUser?.skills || [],
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [snippets, setSnippets] = useState([]);
  const [notes, setNotes] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (!currentUser?.id) return;

      try {
        const [snippetRes, noteRes, resourceRes] = await Promise.all([
          fetch(`${API}/api/snippets/user/${currentUser.id}`),
          fetch(`${API}/api/notes/user/${currentUser.id}`),
          fetch(`${API}/api/resources/user/${currentUser.id}`),
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

    fetchProfileData();
  }, []);

  return (
    <DashboardLayout
      title="My Profile"
      subtitle="Manage your developer identity, skills, and visible work."
    >
      <div className="profile-top-card">
        <div className="profile-left">
          <div className="profile-avatar">
            {profile.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="profile-info">
            <h1>{profile.fullName}</h1>
            <h3>{profile.username}</h3>
            <p className="profile-role">{profile.role}</p>
            <p className="profile-bio">{profile.bio || "No bio added yet."}</p>
          </div>
        </div>

        <Link to="/edit-profile" className="profile-edit-btn">
          Edit Profile
        </Link>
      </div>

      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <p>Total Notes</p>
          <h2>{notes.length}</h2>
        </div>

        <div className="profile-stat-card">
          <p>Total Snippets</p>
          <h2>{snippets.length}</h2>
        </div>

        <div className="profile-stat-card">
          <p>Total Resources</p>
          <h2>{resources.length}</h2>
        </div>

        <div className="profile-stat-card">
          <p>Skills</p>
          <h2>{profile.skills?.length || 0}</h2>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-section-card">
          <h3>Skills</h3>
          <div className="profile-tags">
            {profile.skills?.length > 0 ? (
              profile.skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))
            ) : (
              <span>No skills added</span>
            )}
          </div>
        </div>

        <div className="profile-section-card">
          <h3>About</h3>
          <p>{profile.about || "No about section added yet."}</p>
        </div>

        <div className="profile-section-card">
          <h3>My Notes</h3>
          {notes.length === 0 ? (
            <p>No notes added yet.</p>
          ) : (
            <div className="notes-grid-v2">
              {notes.map((note) => (
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
          <h3>My Snippets</h3>
          {snippets.length === 0 ? (
            <p>No snippets added yet.</p>
          ) : (
            <div className="notes-grid-v2">
              {snippets.map((snippet) => (
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
          <h3>My Resources</h3>
          {resources.length === 0 ? (
            <p>No resources added yet.</p>
          ) : (

            <div className="notes-grid-v2">
              {resources.map((resource) => (
                <NoteCard
                  key={resource._id}
                  note={{
                    title: resource.title,
                    content:
                      resource.description + "\n\nSource: " + resource.link,
                    category: resource.category,
                    visibility: resource.visibility,
                    tags: resource.tags,
                  }}
                  actions={
                    <>
                      <Link
                        to={`/resource/${resource._id}`}
                        className="note-action-link"
                      >
                        View
                      </Link>
                    </>
                  }
                />
              ))}
            </div>
            // <div className="resources-grid">
            //   {resources.map((resource) => (
            //     <div className="resource-card" key={resource._id}>
            //       <div className="resource-top">
            //         <div>
            //           <h3>{resource.title}</h3>
            //           <p>{resource.category}</p>
            //         </div>

            //         <span
            //           className={
            //             resource.visibility === "Public"
            //               ? "resource-badge public-badge"
            //               : "resource-badge private-badge"
            //           }
            //         >
            //           {resource.visibility}
            //         </span>
            //       </div>

            //       <p className="resource-description">{resource.description}</p>

            //       <div className="resource-link-box">
            //         <span>Source:</span>
            //         <p>{resource.link}</p>
            //       </div>

            //       <div className="resource-tags">
            //         {resource.tags.map((tag, index) => (
            //           <span key={index}>{tag}</span>
            //         ))}
            //       </div>
            // </div>
            // ))}
            // </div>
          )}
        </div>
      </div>

      {activeNote && (
        <ReaderModal note={activeNote} onClose={() => setActiveNote(null)} />
      )}
    </DashboardLayout>
  );
}

export default Profile;
