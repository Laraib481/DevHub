import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import NoteCard from "../components/NoteCard";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);

  const savedUser = JSON.parse(localStorage.getItem("user"));

  const fetchNotes = async () => {
    if (!savedUser?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/user/${savedUser.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch notes");
        setLoading(false);
        return;
      }

      setNotes(data);
    } catch (error) {
      console.log(error);
      alert("Something went wrong while fetching notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete note");
        return;
      }

      const updatedNotes = notes.filter((note) => note._id !== id);
      setNotes(updatedNotes);
    } catch (error) {
      console.log(error);
      alert("Something went wrong while deleting note.");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "All" || note.visibility === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout
      title="My Notes"
      subtitle="Store your learning notes, revision points, and developer ideas."
    >
      <div className="notes-header">
        <Link to="/add-note" className="notes-add-btn">
          + Add Note
        </Link>
      </div>

      <div className="notes-toolbar">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="notes-filters">
          <button onClick={() => setFilterType("All")}>All</button>
          <button onClick={() => setFilterType("Public")}>Public</button>
          <button onClick={() => setFilterType("Private")}>Private</button>
        </div>
      </div>

      {loading ? (
        <p className="dashboard-empty-text">Loading notes...</p>
      ) : (
        <div className="notes-grid-v2">
          {filteredNotes.length === 0 ? (
            <p className="dashboard-empty-text">No notes found.</p>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                actions={
                  <>
                    <Link
                      to={`/note/${note._id}`}
                      className="note-action-link"
                    >
                      View
                    </Link>

                    <Link
                      to={`/edit-note/${note._id}`}
                      className="note-action-link"
                    >
                      Edit
                    </Link>

                    <button onClick={() => handleDelete(note._id)}>
                      Delete
                    </button>
                  </>
                }
              />
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Notes;