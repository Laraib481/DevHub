import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setMessage({ type: "error", text: "Email is required" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Something went wrong" });
        return;
      }

      setMessage({ type: "success", text: data.message });

      // Move to the reset screen, carrying the email along.
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1000);
    } catch (error) {
      console.log(error);
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p>Enter your registered email and we'll send you a reset code.</p>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </button>

          <p className="auth-footer-text">
            Remembered it? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
