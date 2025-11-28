import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetAllWritersQuery } from "../../store/api/blogApi";
import { setCredentials } from "../../store/slices/authSlice";
import Card from "../../components/card/card";
import Button from "../../components/button/button";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import "./auth.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const {
    data: writersData,
    isLoading: writersLoading,
    error: writersError,
    refetch: refetchWriters,
  } = useGetAllWritersQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get message from location state (from sign-up redirect)
  const { message, email: prefillEmail } = location.state || {};

  useEffect(() => {
    if (prefillEmail) {
      setFormData((prev) => ({
        ...prev,
        email: prefillEmail,
      }));
    }
  }, [prefillEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name] || loginError) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (writersLoading) {
      setLoginError("Loading user data. Please try again.");
      return;
    }

    if (writersError) {
      setLoginError("Error loading user data. Please try again.");
      return;
    }

    // Support both response shapes from the API:
    // - { writers: [...] }
    // - [...] (array of writers)
    const writersList = Array.isArray(writersData)
      ? writersData
      : writersData?.writers || [];

    if (!writersList || writersList.length === 0) {
      setLoginError("No registered users found. Please sign up first.");
      return;
    }

    const writers = writersList;
    const normalizedEmail = formData.email.trim().toLowerCase();

    // Find writer by email (simple authentication as requested)
    const writer = writers.find(
      (w) => w.email.toLowerCase() === normalizedEmail
    );

    if (!writer) {
      setLoginError(
        "No account found with this email address. Please sign up first."
      );
      return;
    }

    // In a real app, you'd verify the password on the backend
    // For this simplified version, we'll just check if the writer exists
    // You might want to add a simple password check here or use the backend for authentication

    try {
      // Store credentials in Redux and localStorage
      dispatch(
        setCredentials({
          writerId: writer._id,
          email: writer.email,
          writer: writer,
        })
      );

      // Redirect to the user's write page or home
      navigate(`/blog/${writer._id}/write`);
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    }
  };

  if (writersLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (writersError) {
    return (
      <div className="auth-container">
        <Card className="error-card">
          <h2>Error Loading Application</h2>
          <p>
            Unable to load user data: {writersError.message || "Unknown error"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Sign In to Your Account</h1>
        <p>Welcome back! Continue your writing journey</p>
      </div>

      {message && (
        <Card className="success-message">
          <p>{message}</p>
        </Card>
      )}

      <Card className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className={errors.email ? "error" : ""}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={errors.password ? "error" : ""}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {loginError && (
            <div className="error-message submit-error">
              {loginError}
              {loginError.includes("No account found") && (
                <div style={{ marginTop: "8px" }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={() => refetchWriters()}
                  >
                    Refresh Users List
                  </Button>
                </div>
              )}
            </div>
          )}

          {writersError && (
            <div className="error-message submit-error">
              Error loading user data: {writersError.message || "Unknown error"}
              <div style={{ marginTop: "8px" }}>
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="auth-submit"
            disabled={writersLoading || !!writersError}
          >
            {writersLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/auth/sign-up" className="auth-link">
              Sign up here
            </Link>
          </p>
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
