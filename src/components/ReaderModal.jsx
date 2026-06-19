import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import RichNoteContent from "./RichNoteContent";

function ReaderModal({ note, onClose }) {
  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!note) return null;

  return (
    <div className="reader-overlay" onClick={onClose}>
      <div
        className="reader-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="reader-close"
          onClick={onClose}
          aria-label="Close reader"
        >
          <FaTimes />
        </button>

        <div className="reader-meta">
          <span className="reader-category">{note.category}</span>
          {note.visibility && (
            <span className="reader-visibility">{note.visibility}</span>
          )}
        </div>

        <h1 className="reader-title">{note.title}</h1>

        {note.tags?.length > 0 && (
          <div className="reader-chips">
            {note.tags.map((tag, index) => (
              <span className="note-chip" key={index}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="reader-divider"></div>

        <RichNoteContent content={note.content} />
      </div>
    </div>
  );
}

export default ReaderModal;
