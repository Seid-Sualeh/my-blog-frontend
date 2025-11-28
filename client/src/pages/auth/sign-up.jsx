import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCreateWriterMutation } from '../../store/api/blogApi';
import { setCredentials } from '../../store/slices/authSlice';
import { hashPassword, storePasswordHash, validatePasswordStrength } from '../../utils/helpers/index';
import Card from '../../components/card/card';
import Button from '../../components/button/button';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import './auth.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [createWriter, { isLoading }] = useCreateWriterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await createWriter({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        bio: "",
        profileImage: "",
        socialLinks: {
          website: "",
          twitter: "",
          linkedin: "",
        },
        isActive: true,
      }).unwrap();
      
      // Hash and store the password
      const passwordHash = await hashPassword(formData.password);
      storePasswordHash(formData.email.trim().toLowerCase(), passwordHash);
      
      // Redirect to sign-in page with success message
      navigate('/auth/sign-in', {
        state: { 
          message: 'Registration successful! Please sign in with your credentials.',
          email: formData.email.trim().toLowerCase()
        }
      });
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.message || 'Registration failed. Please try again.'
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Creating your account..." />;
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Create Your Writer Account</h1>
        <p>Join our community of talented writers</p>
      </div>

      <Card className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password (min. 6 characters)"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/auth/sign-in" className="auth-link">
              Sign in here
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

export default SignUp;