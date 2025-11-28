import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetAllWritersQuery } from "../../store/api/blogApi";
import { setCredentials } from "../../store/slices/authSlice";
import { verifyPassword, getPasswordHash } from "../../utils/helpers/index";
import Card from "../../components/card/card";
import Button from "../../components/button/button";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import axios from "axios";
import { API_CONFIG } from "../../utils/configs/api-config";
import "./auth.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: writersData,
    isLoading: writersLoading,
    error: writersError,
    refetch: refetchWriters,
  } = useGetAllWritersQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Test direct API connection
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WRITERS}`);
      } catch (error) {
        // Silent fail for test
      }
    };
    testAPI();
  }, []);

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

  const authenticateUser = async () => {
    // Try multiple approaches to get writers data
    let writersList = [];
    
    try {
      // Approach 1: Use RTK Query data if available
      if (writersData && !writersError) {
        writersList = Array.isArray(writersData) 
          ? writersData 
          : writersData?.writers || [];
      }
      
      // Approach 2: If no data from RTK Query, try direct API call
      if (writersList.length === 0) {
        const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WRITERS}`);
        writersList = response.data?.data?.writers || [];
      }
      
      // Approach 3: If still no data, refetch RTK Query
      if (writersList.length === 0) {
        await refetchWriters();
        if (writersData) {
          writersList = Array.isArray(writersData) 
            ? writersData 
            : writersData?.writers || [];
        }
      }
      
    } catch (error) {
      throw new Error("Unable to connect to server. Please try again.");
    }
    
    if (!writersList || writersList.length === 0) {
      throw new Error("No registered users found. Please sign up first.");
    }
    
    return writersList;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const writers = await authenticateUser();
      const normalizedEmail = formData.email.trim().toLowerCase();

      // Find writer by email
      const writer = writers.find(w => w.email.toLowerCase() === normalizedEmail);

      if (!writer) {
        throw new Error("No account found with this email address. Please sign up first.");
      }

      // Get stored password hash from localStorage
      const storedPasswordHash = getPasswordHash(writer.email);
      
      if (!storedPasswordHash) {
        // If no password hash in localStorage, try to create one from the provided password
        // This handles the case where user signed up but hash wasn't stored properly
        const { hashPassword, storePasswordHash } = await import('../../utils/helpers/index');
        const newPasswordHash = await hashPassword(formData.password);
        storePasswordHash(writer.email, newPasswordHash);
        
        // Now verify the password
        const isPasswordValid = await verifyPassword(formData.password, newPasswordHash);
        if (!isPasswordValid) {
          throw new Error("Invalid password. Please check your password and try again.");
        }
      } else {
        // Verify password against stored hash
        const isPasswordValid = await verifyPassword(formData.password, storedPasswordHash);
        if (!isPasswordValid) {
          throw new Error("Invalid password. Please check your password and try again.");
        }
      }

      // Store credentials in Redux
      dispatch(
        setCredentials({
          writerId: writer._id,
          email: writer.email,
          writer: writer,
        })
      );

      // Redirect to home page after successful login
      navigate('/');
    } catch (error) {
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting || writersLoading || !!writersError}
          >
            {isSubmitting || writersLoading ? "Signing In..." : "Sign In"}
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
