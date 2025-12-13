import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Use env-based API URL (works locally + on Render)
const API_URL = import.meta.env.VITE_API_URL || "https://city-server-6geb.onrender.com";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    otherName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    accountType: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const validateStep = () => {
    setError("");

    if (step === 1) {
      const { firstName, lastName, email, phone, address, dob } = formData;
      if (!firstName || !lastName || !email || !phone || !address || !dob) {
        setError("Please fill in all required personal details.");
        return false;
      }
    }

    if (step === 2) {
      const { accountType, password, confirmPassword } = formData;
      if (!accountType || !password || !confirmPassword) {
        setError("Please complete account setup.");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
    }

    if (step === 3) {
      if (!formData.securityQuestion || !formData.securityAnswer) {
        setError("Please set a security question and answer.");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => validateStep() && setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const birthDate = new Date(formData.dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      setError("You must be at least 18 years old to register.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // safe if backend later uses cookies
        body: JSON.stringify({
          ...formData,
          accountType: formData.accountType.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Open Your Bank Account</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Step Indicator */}
        <div className="mb-4 text-center">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={`badge me-2 ${step === n ? "bg-primary" : "bg-secondary"}`}
            >
              {n}
            </span>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            {["firstName", "lastName", "otherName", "email", "phone", "address"].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label text-capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  className="form-control"
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required={field !== "otherName"}
                />
              </div>
            ))}

            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
            </div>

            <button type="button" className="btn btn-primary w-100" onClick={nextStep}>
              Next →
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="mb-3">
              <label className="form-label">Account Type</label>
              <select
                className="form-select"
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                required
              >
                <option value="">-- Select --</option>
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
''''
                <option value="BUSINESS">Business</option>
              </select>
            </div>

            {["password", "confirmPassword"].map((f) => (
              <div className="mb-3" key={f}>
                <label className="form-label">{f === "password" ? "Password" : "Confirm Password"}</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData[f]}
                  onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                  required
                />
              </div>
            ))}

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="mb-3">
              <label className="form-label">Security Question</label>
              <input
                type="text"
                className="form-control"
                value={formData.securityQuestion}
                onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Security Answer</label>
              <input
                type="text"
                className="form-control"
                value={formData.securityAnswer}
                onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>Next →</button>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h5 className="mb-3">Please confirm your details:</h5>
            <ul className="list-group mb-3">
              {Object.entries(formData).map(([k, v]) => (
                <li key={k} className="list-group-item">
                  <strong>{k.replace(/([A-Z])/g, " $1")}:</strong> {k.includes("password") || k.includes("Answer") ? "••••••" : v || "-"}
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Registering..." : "✅ Confirm & Register"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default Register;
