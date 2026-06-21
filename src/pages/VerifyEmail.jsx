import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email is normally passed from Signup / Login. Fall back to an editable
  // field if the user lands here directly.
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const handleVerify = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setMessage({ type: "error", text: "Email is required" });
      return;
    }

    if (!otp.trim()) {
      setMessage({ type: "error", text: "Verification code is required" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Verification failed" });
        return;
      }

      setMessage({ type: "success", text: data.message });

      // Send the user to login after a short pause so they can read the message.
      setTimeout(() => {
        navigate("/login", { state: { email } });
      }, 1200);
    } catch (error) {
      console.log(error);
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage(null);

    if (!email.trim()) {
      setMessage({ type: "error", text: "Enter your email to resend the code" });
      return;
    }

    setResending(true);

    try {
      const response = await fetch(
        `${API}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Could not resend code" });
        return;
      }

      setMessage({ type: "success", text: "A new code has been sent to your email." });
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
        <h1>Verify Email</h1>
        <p>Enter the 6-digit code we sent to your email to activate your account.</p>

        {message && (
          <div className={`auth-message auth-message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleVerify} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={Boolean(location.state?.email)}
            />
          </div>

          <div className="input-group">
            <label>Verification Code</label>
            <input
              type="text"
              name="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code"
              className="otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
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

export default VerifyEmail;
