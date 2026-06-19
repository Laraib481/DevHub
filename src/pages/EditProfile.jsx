import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    role: "",
    bio: "",
    about: "",
    skills: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      setFormData({
        fullName: savedUser.fullName || "",
        username: savedUser.username || "",
        role: savedUser.role || "",
        bio: savedUser.bio || "",
        about: savedUser.about || "",
        skills: (savedUser.skills || []).join(", "),
      });
    }
  }, []);

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
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    if (!formData.about.trim()) {
      newErrors.about = "About section is required";
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

    const payload = {
      fullName: formData.fullName,
      username: formData.username,
      role: formData.role,
      bio: formData.bio,
      about: formData.about,
      skills: formData.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      publicNotes: savedUser.publicNotes || [],
      publicSnippets: savedUser.publicSnippets || [],
      publicResources: savedUser.publicResources || [],
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/profile/${savedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Profile update failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("profile");

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      alert("Something went wrong while updating profile.");
    }
  };

  return (
    <DashboardLayout
      title="Edit Profile"
      subtitle="Update your profile details and developer identity."
    >
      <div className="add-note-page">
        <div className="add-note-card">
          <form onSubmit={handleSubmit} className="add-note-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <span className="error-text">{errors.fullName}</span>
              )}
            </div>

            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <span className="error-text">{errors.username}</span>
              )}
            </div>

            <div className="input-group">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
              {errors.role && (
                <span className="error-text">{errors.role}</span>
              )}
            </div>

            <div className="input-group">
              <label>Short Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
              />
              {errors.bio && <span className="error-text">{errors.bio}</span>}
            </div>

            <div className="input-group">
              <label>About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="6"
              />
              {errors.about && (
                <span className="error-text">{errors.about}</span>
              )}
            </div>

            <div className="input-group">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="add-note-btn">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditProfile;