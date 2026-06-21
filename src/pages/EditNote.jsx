import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    visibility: "Private",
    tags: "",
    content: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`${API}/api/notes/${id}`);
        const data = await response.json();

        if (!response.ok) {
          navigate("/notes");
          return;
        }

        setFormData({
          title: data.title,
          category: data.category,
          visibility: data.visibility,
          tags: data.tags.join(", "),
          content: data.content,
        });
      } catch (error) {
        console.log(error);
        navigate("/notes");
      }
    };

    fetchNote();
  }, [id, navigate]);

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

    try {
      const response = await fetch(`${API}/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        alert(data.message || "Failed to update note");
        return;
      }

      alert("Note updated successfully!");
      navigate("/notes");
    } catch (error) {
      console.log(error);
      alert("Something went wrong while updating note.");
    }
  };

  return (
    <DashboardLayout title="Edit Note" subtitle="Update your saved note.">
      <div className="add-note-page">
        <div className="add-note-card">
          <form onSubmit={handleSubmit} className="add-note-form">
            <div className="input-group">
              <label>Note Title</label>
              <input
                type="text"
                name="title"
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
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="10"
              />
              {errors.content && (
                <span className="error-text">{errors.content}</span>
              )}
            </div>

            <button type="submit" className="add-note-btn">
              Update Note
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditNote;