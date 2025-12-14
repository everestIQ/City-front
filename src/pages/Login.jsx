import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

import { saveAuthData } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await loginUser({ email, password });

    const { token, user } = res.data;
    saveAuthData(token, user, remember);

    navigate(user.role === "ADMIN" ? "/admin-dashboard" : "/dashboard");
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.error || "Login failed");
  }
};


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-3">User Login</h3>
        <form onSubmit={handleLogin}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="form-check-label">Remember Me</label>
            </div>
            <a href="#" className="text-decoration-none small">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <a href="/register" className="text-decoration-none">
              Register
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
