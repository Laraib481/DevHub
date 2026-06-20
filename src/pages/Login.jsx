// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// function Login() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null); // { type, text }

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     setErrors({
//       ...errors,
//       [name]: "",
//     });
//   };

//   const validateForm = () => {
//     let newErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     }

//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setMessage(null);

//     const validationErrors = validateForm();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // Unverified accounts are sent to the verification screen.
//         if (data.requiresVerification) {
//           setMessage({
//             type: "error",
//             text: data.message || "Please verify your email first.",
//           });
//           setTimeout(() => {
//             navigate("/verify-email", {
//               state: { email: data.email || formData.email },
//             });
//           }, 1000);
//           return;
//         }

//         setMessage({ type: "error", text: data.message || "Login failed" });
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       localStorage.removeItem("profile");

//       setMessage({ type: "success", text: "Login successful" });
//       navigate("/dashboard");
//     } catch (error) {
//       console.log(error);
//       setMessage({ type: "error", text: "Server error. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <h1>Login</h1>
//         <p>Welcome back to DevHub</p>

//         {message && (
//           <div className={`auth-message auth-message-${message.type}`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="input-group">
//             <label>Email</label>

//             <input
//               type="email"
//               name="email"
//               placeholder="Enter email"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             {errors.email && (
//               <span className="error-text">{errors.email}</span>
//             )}
//           </div>

//           <div className="input-group">
//             <label>Password</label>

//             <div className="password-wrapper">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Enter password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />

//               <button
//                 type="button"
//                 className="toggle-password"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>

//             {errors.password && (
//               <span className="error-text">{errors.password}</span>
//             )}
//           </div>

//           <div className="auth-inline-link">
//             <Link to="/forgot-password">Forgot Password?</Link>
//           </div>

//           <button type="submit" className="auth-submit-btn" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           <p className="auth-footer-text">
//             Don't have an account? <Link to="/signup">Signup</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api"; // ✅ backend base URL

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Basic validation
  const validateForm = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // ❌ LOGIN FAILED
      if (!response.ok) {
        if (data.requiresVerification) {
          setMessage({
            type: "error",
            text: data.message || "Please verify your email first.",
          });

          setTimeout(() => {
            navigate("/verify-email", {
              state: { email: formData.email },
            });
          }, 1000);

          return;
        }

        setMessage({
          type: "error",
          text: data.message || "Login failed",
        });

        return;
      }

      // ✅ LOGIN SUCCESS
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("profile");

      setMessage({
        type: "success",
        text: "Login successful 🚀",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      console.log(error);

      setMessage({
        type: "error",
        text: "Server error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Welcome back to DevHub</p>

        {message && (
          <div className={`auth-message auth-message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
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

            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* FORGOT PASSWORD */}
          <div className="auth-inline-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* SIGNUP LINK */}
          <p className="auth-footer-text">
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;