import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api";

function EditSnippet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    language: "",
    visibility: "Private",
    description: "",
    tags: "",
    code: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(`${API}/api/snippets/${id}`);
        const data = await response.json();

        if (!response.ok) {
          navigate("/snippets");
          return;
        }

        setFormData({
          title: data.title,
          language: data.language,
          visibility: data.visibility,
          description: data.description,
          tags: data.tags.join(", "),
          code: data.code,
        });
      } catch (error) {
        console.log(error);
        navigate("/snippets");
      }
    };

    fetchSnippet();
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

    if (!formData.language.trim()) {
      newErrors.language = "Language is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
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
      const response = await fetch(`${API}/api/snippets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          language: formData.language,
          visibility: formData.visibility,
          description: formData.description,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
          code: formData.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update snippet");
        return;
      }

      alert("Snippet updated successfully!");
      navigate("/snippets");
    } catch (error) {
      console.log(error);
      alert("Something went wrong while updating snippet.");
    }
  };

  return (
    <DashboardLayout
      title="Edit Snippet"
      subtitle="Update your saved snippet details and code."
    >
      <div className="add-snippet-page">
        <div className="add-snippet-card">
          <form onSubmit={handleSubmit} className="add-snippet-form">
            <div className="input-group">
              <label>Snippet Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter snippet title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="add-snippet-row">
              <div className="input-group">
                <label>Language</label>
                <input
                  type="text"
                  name="language"
                  placeholder="e.g. JavaScript, CSS, JSX"
                  value={formData.language}
                  onChange={handleChange}
                />
                {errors.language && (
                  <span className="error-text">{errors.language}</span>
                )}
              </div>

              <div className="input-group">
                <label>Visibility</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Write a short description of this snippet"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
              {errors.description && (
                <span className="error-text">{errors.description}</span>
              )}
            </div>

            <div className="input-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="e.g. React, Forms, Auth"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Code</label>
              <textarea
                name="code"
                placeholder="Paste your code here..."
                value={formData.code}
                onChange={handleChange}
                rows="10"
              />
              {errors.code && <span className="error-text">{errors.code}</span>}
            </div>

            <button type="submit" className="add-snippet-btn">
              Update Snippet
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditSnippet;