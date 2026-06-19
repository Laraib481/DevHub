import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import CodeBlock from "../components/CodeBlock";

function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);

  const savedUser = JSON.parse(localStorage.getItem("user"));

  const fetchSnippets = async () => {
    if (!savedUser?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/snippets/user/${savedUser.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch snippets");
        setLoading(false);
        return;
      }

      setSnippets(data);
    } catch (error) {
      console.log(error);
      alert("Something went wrong while fetching snippets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/snippets/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete snippet");
        return;
      }

      const updatedSnippets = snippets.filter((snippet) => snippet._id !== id);
      setSnippets(updatedSnippets);
    } catch (error) {
      console.log(error);
      alert("Something went wrong while deleting snippet.");
    }
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "All" || snippet.visibility === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout
      title="My Snippets"
      subtitle="Organize, manage, and preview your reusable code snippets."
    >
      <div className="snippets-header">
        <Link to="/add-snippet" className="snippets-add-btn">
          + Add Snippet
        </Link>
      </div>

      <div className="snippets-toolbar">
        <input
          type="text"
          placeholder="Search snippets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="snippets-filters">
          <button onClick={() => setFilterType("All")}>All</button>
          <button onClick={() => setFilterType("Public")}>Public</button>
          <button onClick={() => setFilterType("Private")}>Private</button>
        </div>
      </div>

      {loading ? (
        <p className="dashboard-empty-text">Loading snippets...</p>
      ) : (
        <div className="snippets-grid">
          {filteredSnippets.length === 0 ? (
            <p>No snippets found.</p>
          ) : (
            filteredSnippets.map((snippet) => (
              <div className="snippet-card" key={snippet._id}>
                <div className="snippet-top">
                  <div>
                    <h3>{snippet.title}</h3>
                    <p>{snippet.language}</p>
                  </div>

                  <span
                    className={
                      snippet.visibility === "Public"
                        ? "snippet-badge public-badge"
                        : "snippet-badge private-badge"
                    }
                  >
                    {snippet.visibility}
                  </span>
                </div>

                <p className="snippet-description">{snippet.description}</p>

                <div className="snippet-tags">
                  {snippet.tags.map((tag, index) => (
                    <span key={index}>{tag}</span>
                  ))}
                </div>

                <CodeBlock code={snippet.code} language={snippet.language} />

                <div className="snippet-actions">
                  <Link
                    to={`/snippet/${snippet._id}`}
                    className="snippet-action-link"
                  >
                    View
                  </Link>

                  <Link
                    to={`/edit-snippet/${snippet._id}`}
                    className="snippet-action-link"
                  >
                    Edit
                  </Link>

                  <button onClick={() => handleDelete(snippet._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Snippets;