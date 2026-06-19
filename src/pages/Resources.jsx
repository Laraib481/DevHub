import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import NoteCard from "../components/NoteCard";

function Resources() {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);

  const savedUser = JSON.parse(localStorage.getItem("user"));

  const fetchResources = async () => {
    if (!savedUser?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/resources/user/${savedUser.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch resources");
        setLoading(false);
        return;
      }

      setResources(data);
    } catch (error) {
      console.log(error);
      alert("Something went wrong while fetching resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete resource");
        return;
      }

      const updatedResources = resources.filter((resource) => resource._id !== id);
      setResources(updatedResources);
    } catch (error) {
      console.log(error);
      alert("Something went wrong while deleting resource.");
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "All" || resource.visibility === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout
      title="My Resources"
      subtitle="Store useful links, tools, and learning references."
    >
      <div className="resources-header">
        <Link to="/add-resource" className="resources-add-btn">
          + Add Resource
        </Link>
      </div>

      <div className="resources-toolbar">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="resources-filters">
          <button onClick={() => setFilterType("All")}>All</button>
          <button onClick={() => setFilterType("Public")}>Public</button>
          <button onClick={() => setFilterType("Private")}>Private</button>
        </div>
      </div>

      {loading ? (
        <p className="dashboard-empty-text">Loading resources...</p>
      ) : (
         <div className="notes-grid-v2">
        {
          filteredResources.length === 0 ? (
            <p className="dashboard-empty-text">No resources found.</p>
          ) : (
            filteredResources.map((resource) => (
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

                    <Link
                      to={`/edit-resource/${resource._id}`}
                      className="note-action-link"
                    >
                      Edit
                    </Link>

                    <button onClick={() => handleDelete(resource._id)}>
                      Delete
                    </button>
                  </>
                }
              />
            ))
          )
        }
     </div>
  )
}
    </DashboardLayout >
  );
}

export default Resources;
