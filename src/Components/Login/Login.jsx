import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    ipAddress: "192.168.4.65:10186/getdbcre",
    username: "user",
    password: "123",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send GET request to the API endpoint specified in the ipAddress field
      const response = await fetch(`http://${formData.ipAddress}`, {
        method: "POST",
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        console.log("Login successful. Server response:", data);
        alert("Login successful! Redirecting to the dashboard...");
        navigate("/Dashboard"); // Navigate to the Dashboard
      } else {
        console.error("Login failed:", data.error);
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error connecting to the API:", err.message);
      setLoading(false);
      setError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>AASL CCTV Operator Login</h1>
          <p className="login-subtitle">
            Secure access to the CCTV surveillance system.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* IP Address Field */}
          <div className="input-group">
            <label htmlFor="ipAddress">API Endpoint</label>
            <input
              type="text"
              id="ipAddress"
              name="ipAddress"
              placeholder="Enter API Endpoint (e.g., 192.168.4.65:10186/getdbcre)"
              value={formData.ipAddress}
              onChange={handleChange}
              required
            />
          </div>

          {/* Username Field */}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <footer className="login-footer">
          <p>© 2024 AASL. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
