import React, { useState } from "react";
import "./style.css";
import MyButton from "../../components/button";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    // If this is called directly from the MyButton component,
    // you may not need to prevent default
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      // For demonstration - in a real app, this would be an actual API call
      if (credentials.email && credentials.password) {
        console.log("Login successful", { ...credentials, rememberMe });
        // Redirect to dashboard or handle successful login
      } else {
        setError("Please enter valid credentials");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Super Admin</h2>
          <p className="login-subtitle">Sign in to your dashboard</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // We'll let the MyButton component call handleSubmit
            // instead of triggering it here
          }}
        >
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="form-input"
              placeholder="admin@company.com"
              required
            />
          </div>

          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password" className="form-label">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="button-container">
            <MyButton
              name="Login"
              width={150}
              color={"#2D3436"}
              onClick={handleSubmit}
              loading={isLoading}
            />
          </div>
        </form>

        <div className="login-footer">
          <p className="security-message">
            © 2025 - GoBus Digital Mobility Solutions Limited.
          </p>
        </div>
      </div>
    </div>
  );
}
