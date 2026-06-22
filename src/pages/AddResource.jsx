import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api";
function AddResource() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    visibility: "Public",
    link: "",
    tags: "",
    description: "",
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

    if (!formData.link.trim()) {
      newErrors.link = "Link is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
      const response = await fetch(`${API}/api/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: savedUser.id,
          title: formData.title,
          category: formData.category,
          visibility: formData.visibility,
          link: formData.link,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create resource");
        return;
      }

      alert("Resource created successfully!");

      setFormData({
        title: "",
        category: "",
        visibility: "Public",
        link: "",
        tags: "",
        description: "",
      });

      navigate("/resources");
    } catch (error) {
      console.log(error);
      alert("Something went wrong while creating resource.");
    }
  };

  return (
    <DashboardLayout
      title="Add Resource"
      subtitle="Save a useful developer resource, link, or learning reference."
    >
      <div className="add-resource-page">
        <div className="add-resource-card">
          <form onSubmit={handleSubmit} className="add-resource-form">
            <div className="input-group">
              <label>Resource Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter resource title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="add-resource-row">
              <div className="input-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Documentation, Video, Article"
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
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Link</label>
              <input
                type="text"
                name="link"
                placeholder="Paste the resource link"
                value={formData.link}
                onChange={handleChange}
              />
              {errors.link && <span className="error-text">{errors.link}</span>}
            </div>

            <div className="input-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="e.g. React, Routing, Docs"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Write a short description of this resource"
                value={formData.description}
                onChange={handleChange}
                rows="8"
              />
              {errors.description && (
                <span className="error-text">{errors.description}</span>
              )}
            </div>

            <button type="submit" className="add-resource-btn">
              Save Resource
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddResource;