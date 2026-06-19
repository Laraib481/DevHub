import { useEffect, useRef, useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import Prism from "prismjs";

// Language grammars (loaded once). clike/markup/css are prerequisites for others.
import "prismjs/components/prism-markup.min";
import "prismjs/components/prism-clike.min";
import "prismjs/components/prism-css.min";
import "prismjs/components/prism-javascript.min";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-typescript.min";
import "prismjs/components/prism-python.min";
import "prismjs/components/prism-json.min";
import "prismjs/components/prism-bash.min";
import "prismjs/components/prism-c.min";
import "prismjs/components/prism-cpp.min";
import "prismjs/components/prism-java.min";
import "prismjs/components/prism-go.min";
import "prismjs/components/prism-rust.min";
import "prismjs/components/prism-sql.min";
// markup-templating is a required prerequisite of prism-php; importing php
// without it registers tokenize hooks that throw on every Prism.highlight call.
import "prismjs/components/prism-markup-templating.min";
import "prismjs/components/prism-php.min";

// Normalize user-supplied language labels to Prism grammar keys.
const LANGUAGE_ALIASES = {
  js: "javascript",
  javascript: "javascript",
  jsx: "jsx",
  ts: "typescript",
  typescript: "typescript",
  tsx: "tsx",
  py: "python",
  python: "python",
  json: "json",
  sh: "bash",
  bash: "bash",
  shell: "bash",
  html: "markup",
  xml: "markup",
  markup: "markup",
  css: "css",
  c: "c",
  "c++": "cpp",
  cpp: "cpp",
  java: "java",
  go: "go",
  golang: "go",
  rust: "rust",
  rs: "rust",
  sql: "sql",
  php: "php",
};

const LANGUAGE_LABELS = {
  javascript: "JavaScript",
  jsx: "JSX",
  typescript: "TypeScript",
  python: "Python",
  json: "JSON",
  bash: "Bash",
  markup: "HTML",
  css: "CSS",
  c: "C",
  cpp: "C++",
  java: "Java",
  go: "Go",
  rust: "Rust",
  sql: "SQL",
  php: "PHP",
};

function CodeBlock({ code = "", language = "javascript" }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const normalized = LANGUAGE_ALIASES[language?.toLowerCase()] || "javascript";
  const grammar = Prism.languages[normalized] || Prism.languages.javascript;
  const label = LANGUAGE_LABELS[normalized] || "Code";

  const highlighted = Prism.highlight(code, grammar, normalized);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="code-block-dots">
          <span className="cb-dot cb-dot-red"></span>
          <span className="cb-dot cb-dot-yellow"></span>
          <span className="cb-dot cb-dot-green"></span>
        </div>

        <span className="code-block-lang">{label}</span>

        <button
          type="button"
          className="code-block-copy"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? <FaCheck /> : <FaRegCopy />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className={`code-block-pre language-${normalized}`}>
        <code
          ref={codeRef}
          className={`language-${normalized}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}

export default CodeBlock;
