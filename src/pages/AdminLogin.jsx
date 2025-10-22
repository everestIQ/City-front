import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveAuthData } from "../utils/auth";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/auth/login", formData);
      console.log("Admin login response:", res.data);

      if (res.data.user.role !== "ADMIN") {
        setMessage("❌ You are not authorized as an admin");
        return;
      }

      // Save token + role + user info
      saveAuthData(res.data.token, res.data.user);

      setMessage("✅ " + res.data.message);
      navigate("/admin-dashboard");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Login failed"));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-3">Admin Login</h3>
        <form onSubmit={handleSubmit}>
          {message && (
            <div
              className={`alert ${
                message.startsWith("✅") ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Login as Admin
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Not an admin?{" "}
            <a href="/login" className="text-decoration-none">
              Go back to user login
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
