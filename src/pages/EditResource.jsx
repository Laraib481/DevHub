import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api";

function EditResource() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`${API}/api/resources/${id}`);
        const data = await response.json();

        if (!response.ok) {
          navigate("/resources");
          return;
        }

        setFormData({
          title: data.title,
          category: data.category,
          visibility: data.visibility,
          link: data.link,
          tags: data.tags.join(", "),
          description: data.description,
        });
      } catch (error) {
        console.log(error);
        navigate("/resources");
      }
    };

    fetchResource();
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

    try {
      const response = await fetch(`${API}/api/resources/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        alert(data.message || "Failed to update resource");
        return;
      }

      alert("Resource updated successfully!");
      navigate("/resources");
    } catch (error) {
      console.log(error);
      alert("Something went wrong while updating resource.");
    }
  };

  return (
    <DashboardLayout
      title="Edit Resource"
      subtitle="Update your saved resource."
    >
      <div className="add-resource-page">
        <div className="add-resource-card">
          <form onSubmit={handleSubmit} className="add-resource-form">
            <div className="input-group">
              <label>Resource Title</label>
              <input
                type="text"
                name="title"
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
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
              />
              {errors.description && (
                <span className="error-text">{errors.description}</span>
              )}
            </div>

            <button type="submit" className="add-resource-btn">
              Update Resource
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditResource;