import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function SnippetDetails() {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/snippets/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setSnippet(null);
          setLoading(false);
          return;
        }

        setSnippet(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout
        title="Loading Snippet"
        subtitle="Please wait while the snippet loads."
      >
        <p className="dashboard-empty-text">Loading snippet...</p>
      </DashboardLayout>
    );
  }

  if (!snippet) {
    return (
      <DashboardLayout
        title="Snippet Not Found"
        subtitle="The snippet you are looking for does not exist."
      >
        <p>Snippet not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={snippet.title}
      subtitle="View your full snippet details and code."
    >
      <div className="snippet-details-card">
        <div className="snippet-details-top">
          <p><strong>Language:</strong> {snippet.language}</p>
          <p><strong>Visibility:</strong> {snippet.visibility}</p>
        </div>

        <div className="snippet-details-section">
          <h3>Description</h3>
          <p>{snippet.description}</p>
        </div>

        <div className="snippet-details-section">
          <h3>Tags</h3>
          <div className="snippet-tags">
            {snippet.tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="snippet-details-section">
          <h3>Code</h3>
          <div className="snippet-full-code">
            <pre><code>{snippet.code}</code></pre>
          </div>
        </div>

        <Link to="/snippets" className="back-snippet-btn">
          Back to Snippets
        </Link>
      </div>
    </DashboardLayout>
  );
}

export default SnippetDetails;