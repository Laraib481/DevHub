import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "otp" ? value.replace(/\D/g, "") : value;

    setFormData({ ...formData, [name]: nextValue });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.otp.trim()) {
      newErrors.otp = "Reset code is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Reset failed" });
        return;
      }

      setMessage({ type: "success", text: data.message });

      setTimeout(() => {
        navigate("/login", { state: { email: formData.email } });
      }, 1200);
    } catch (error) {
      console.log(error);
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Re-request a code from the forgot-password endpoint.
  const handleResend = async () => {
    setMessage(null);

    if (!formData.email.trim()) {
      setMessage({ type: "error", text: "Enter your email to resend the code" });
      return;
    }

    setResending(true);

    try {
      const response = await fetch(
        `${API}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Could not resend code" });
        return;
      }

      setMessage({ type: "success", text: "A new reset code has been sent." });
    } catch (error) {
      console.log(error);
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>
        <p>Enter the code sent to your email and choose a new password.</p>

        {message && (
          <div className={`auth-message auth-message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              readOnly={Boolean(location.state?.email)}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Reset Code</label>
            <input
              type="text"
              name="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code"
              className="otp-input"
              value={formData.otp}
              onChange={handleChange}
            />
            {errors.otp && <span className="error-text">{errors.otp}</span>}
          </div>

          <div className="input-group">
            <label>New Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Create a new password"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="error-text">{errors.newPassword}</span>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            className="link-button"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend code"}
          </button>

          <p className="auth-footer-text">
            Back to <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
