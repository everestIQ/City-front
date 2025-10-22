// pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

  const [error, setError] = useState("");

  const validateStep = () => {
    setError("");
    if (step === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.dob
      ) {
        setError("Please fill in all required personal details.");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.accountType || !formData.password || !formData.confirmPassword) {
        setError("Please complete account setup.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
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

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const birthDate = new Date(formData.dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setError("You must be at least 18 years old to register.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          accountType: formData.accountType.toUpperCase(), // ensure enum matches backend
        }),
      });

      if (!res.ok) throw new Error("Registration failed");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Open Your Bank Account</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Step Indicator */}
        <div className="mb-4 text-center">
          <span className={`badge me-2 ${step === 1 ? "bg-primary" : "bg-secondary"}`}>1</span>
          <span className={`badge me-2 ${step === 2 ? "bg-primary" : "bg-secondary"}`}>2</span>
          <span className={`badge me-2 ${step === 3 ? "bg-primary" : "bg-secondary"}`}>3</span>
          <span className={`badge ${step === 4 ? "bg-primary" : "bg-secondary"}`}>4</span>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Other Name (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={formData.otherName}
                onChange={(e) => setFormData({ ...formData, otherName: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Home Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

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

        {/* Step 2: Account Setup */}
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
                <option value="CHECKING">Checking</option>
                <option value="BUSINESS">Business</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* Step 3: Security */}
        {step === 3 && (
          <>
            <div className="mb-3">
              <label className="form-label">Security Question</label>
              <input
                type="text"
                className="form-control"
                placeholder="E.g. What is your mother's maiden name?"
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
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <>
            <h5 className="mb-3">Please confirm your details:</h5>
            <ul className="list-group mb-3">
              <li className="list-group-item"><strong>First Name:</strong> {formData.firstName}</li>
              <li className="list-group-item"><strong>Last Name:</strong> {formData.lastName}</li>
              <li className="list-group-item"><strong>Other Name:</strong> {formData.otherName || "-"}</li>
              <li className="list-group-item"><strong>Email:</strong> {formData.email}</li>
              <li className="list-group-item"><strong>Phone:</strong> {formData.phone}</li>
              <li className="list-group-item"><strong>Address:</strong> {formData.address}</li>
              <li className="list-group-item"><strong>Date of Birth:</strong> {formData.dob}</li>
              <li className="list-group-item"><strong>Account Type:</strong> {formData.accountType}</li>
              <li className="list-group-item"><strong>Password:</strong> {"•".repeat(formData.password.length)}</li>
              <li className="list-group-item"><strong>Security Question:</strong> {formData.securityQuestion}</li>
              <li className="list-group-item"><strong>Security Answer:</strong> {"•".repeat(formData.securityAnswer.length)}</li>
            </ul>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button type="submit" className="btn btn-success">
                ✅ Confirm & Register
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default Register;
