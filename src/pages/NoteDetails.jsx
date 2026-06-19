import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import RichNoteContent from "../components/RichNoteContent";

function NoteDetails() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notes/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setNote(null);
          setLoading(false);
          return;
        }

        setNote(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout
        title="Loading Note"
        subtitle="Please wait while the note loads."
      >
        <p className="dashboard-empty-text">Loading note...</p>
      </DashboardLayout>
    );
  }

  if (!note) {
    return (
      <DashboardLayout
        title="Note Not Found"
        subtitle="The note you are looking for does not exist."
      >
        <p>Note not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={note.title} subtitle="View your full note details.">
      <article className="note-article">
        <div className="note-article-meta">
          <span className="reader-category">{note.category}</span>
          <span className="reader-visibility">{note.visibility}</span>
        </div>

        <h1 className="note-article-title">{note.title}</h1>

        {note.tags?.length > 0 && (
          <div className="note-article-chips">
            {note.tags.map((tag, index) => (
              <span className="note-chip" key={index}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="reader-divider"></div>

        <RichNoteContent content={note.content} />

        <Link to="/notes" className="back-snippet-btn">
          Back to Notes
        </Link>
      </article>
    </DashboardLayout>
  );
}

export default NoteDetails;