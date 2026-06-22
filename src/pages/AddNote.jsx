import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api";

function AddNote() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    visibility: "Private",
    tags: "",
    content: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser?.id) {
      alert("User not found. Please login again.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: savedUser.id,
          title: formData.title,
          category: formData.category,
          visibility: formData.visibility,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
          content: formData.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create note");
        return;
      }

      alert("Note created successfully!");

      setFormData({
        title: "",
        category: "",
        visibility: "Private",
        tags: "",
        content: "",
      });

      navigate("/notes");
    } catch (error) {
      console.log(error);
      alert("Something went wrong while creating note.");
    }
  };

  return (
    <DashboardLayout
      title="Add Note"
      subtitle="Create and organize a new learning or revision note."
    >
      <div className="add-note-page">
        <div className="add-note-card">
          <form onSubmit={handleSubmit} className="add-note-form">
            <div className="input-group">
              <label>Note Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter note title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="add-note-row">
              <div className="input-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. React, JavaScript, Interview"
                  value={formData.category}
                  onChange={handleChange}
                />
                {errors.category && (
                  <span className="error-text">{errors.category}</span>
                )}
              </div>

              <div className="input-group">
                <label>Visibility</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                >
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="e.g. Hooks, Frontend, Revision"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Content</label>
              <textarea
                name="content"
                placeholder={"Write your note here...\n\nTip: wrap code in triple backticks to render it as a highlighted code block:\n```js\nconst hello = () => console.log(\"hi\");\n```"}
                value={formData.content}
                onChange={handleChange}
                rows="10"
              />
              <span className="input-hint">
                Tip: wrap code in <code>```js … ```</code> fences to render a
                VS Code–style highlighted block.
              </span>
              {errors.content && (
                <span className="error-text">{errors.content}</span>
              )}
            </div>

            <button type="submit" className="add-note-btn">
              Save Note
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddNote;