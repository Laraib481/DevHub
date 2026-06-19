import CodeBlock from "./CodeBlock";

// Splits raw note text into ordered segments of prose and fenced code blocks.
// Fenced code uses markdown syntax:  ```lang \n ...code... \n ```
function parseSegments(text) {
  const segments = [];
  const fenceRegex = /```([a-zA-Z0-9+#]*)\n?([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  while ((match = fenceRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "prose",
        value: text.slice(lastIndex, match.index),
      });
    }

    segments.push({
      type: "code",
      language: match[1] || "javascript",
      value: match[2].replace(/\n$/, ""),
    });

    lastIndex = fenceRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "prose", value: text.slice(lastIndex) });
  }

  return segments;
}

// Renders a single prose segment: paragraphs split on blank lines, with
// inline `code` spans highlighted. Keeps everything as structured elements.
function Prose({ value }) {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p className="note-prose-paragraph" key={index}>
          {renderInline(paragraph)}
        </p>
      ))}
    </>
  );
}

// Converts single-backtick inline code into styled <code> spans.
function renderInline(paragraph) {
  const parts = paragraph.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code className="note-inline-code" key={index}>
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function RichNoteContent({ content = "" }) {
  const segments = parseSegments(content);

  return (
    <div className="note-rich-content">
      {segments.map((segment, index) =>
        segment.type === "code" ? (
          <CodeBlock
            key={index}
            code={segment.value}
            language={segment.language}
          />
        ) : (
          <Prose key={index} value={segment.value} />
        )
      )}
    </div>
  );
}

export default RichNoteContent;
