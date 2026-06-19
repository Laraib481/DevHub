import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function ResourceDetails() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/resources/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setResource(null);
          setLoading(false);
          return;
        }

        setResource(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout
        title="Loading Resource"
        subtitle="Please wait while the resource loads."
      >
        <p className="dashboard-empty-text">Loading resource...</p>
      </DashboardLayout>
    );
  }

  if (!resource) {
    return (
      <DashboardLayout
        title="Resource Not Found"
        subtitle="The resource you are looking for does not exist."
      >
        <p>Resource not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={resource.title}
      subtitle="View your full resource details."
    >
      <div className="snippet-details-card">
        <div className="snippet-details-top">
          <p><strong>Category:</strong> {resource.category}</p>
          <p><strong>Visibility:</strong> {resource.visibility}</p>
        </div>

        <div className="snippet-details-section">
          <h3>Description</h3>
          <p>{resource.description}</p>
        </div>

        <div className="snippet-details-section">
          <h3>Source Link</h3>
          <div className="resource-link-box">
            <span>Source:</span>
            <p>{resource.link}</p>
          </div>
        </div>

        <div className="snippet-details-section">
          <h3>Tags</h3>
          <div className="resource-tags">
            {resource.tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </div>

        <Link to="/resources" className="back-snippet-btn">
          Back to Resources
        </Link>
      </div>
    </DashboardLayout>
  );
}

export default ResourceDetails;