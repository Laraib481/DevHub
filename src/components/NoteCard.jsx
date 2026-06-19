import { FaCode, FaRegFileAlt } from "react-icons/fa";

// Builds a clean text preview by removing fenced code blocks and inline
// backticks, so the card shows readable prose rather than raw markup.
function buildPreview(content = "") {
  const withoutCode = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return withoutCode || "Open to read the full note.";
}

function hasCode(content = "") {
  return /```[\s\S]*?```/.test(content);
}

function NoteCard({ note, onOpen, actions }) {
  const preview = buildPreview(note.content);
  const containsCode = hasCode(note.content);
  const clickable = typeof onOpen === "function";

  return (
    <article
      className={`note-card-v2 ${clickable ? "note-card-clickable" : ""}`}
      onClick={clickable ? () => onOpen(note) : undefined}
    >
      <div className="note-card-v2-head">
        <span className="note-card-v2-category">
          {containsCode ? <FaCode /> : <FaRegFileAlt />}
          {note.category}
        </span>

        {note.visibility && (
          <span
            className={
              note.visibility === "Public"
                ? "note-pill note-pill-public"
                : "note-pill note-pill-private"
            }
          >
            {note.visibility}
          </span>
        )}
      </div>

      <h3 className="note-card-v2-title">{note.title}</h3>

      <p className="note-card-v2-preview">{preview}</p>

      {note.tags?.length > 0 && (
        <div className="note-card-v2-chips">
          {note.tags.map((tag, index) => (
            <span className="note-chip" key={index}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {containsCode && (
        <div className="note-card-v2-codehint">
          <FaCode /> Contains code
        </div>
      )}

      {actions && (
        <div
          className="note-card-v2-actions"
          onClick={(event) => event.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </article>
  );
}

export default NoteCard;
