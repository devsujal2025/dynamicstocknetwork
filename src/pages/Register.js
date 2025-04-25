import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await registerUser(formData);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 sec
    } catch (err) {
      setError("Registration failed! Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Register</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role Selection Buttons */}
              <div className="mb-3 text-center">
                <label className="form-label d-block">Select Role</label>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className={`btn me-2 ${
                      formData.role === "customer" ? "btn-primary active" : "btn-outline-primary"
                    }`}
                    style={{
                      transition: "0.3s",
                      padding: "10px 20px",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleRoleSelect("customer")}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      formData.role === "pharmacist" ? "btn-success active" : "btn-outline-success"
                    }`}
                    style={{
                      transition: "0.3s",
                      padding: "10px 20px",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleRoleSelect("pharmacist")}
                  >
                    Pharmacist
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>

            <p className="mt-3 text-center">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
