import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentWriter, logout } from '../../../store/slices/authSlice';
import Button from '../../../components/button/button';
import './header.css';

const Header = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentWriter = useSelector(selectCurrentWriter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <Link to="/">
            <h1>📝 Blog Platform</h1>
            <p>Share your stories with the world</p>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            🏠 Home
          </Link>
          <Link to="/become-a-writer" className="nav-link">
            ✍️ Become a Writer
          </Link>
        </nav>

        <div className="header-actions">
          {isAuthenticated && currentWriter ? (
            <>
              <span className="welcome-text">
                Welcome, {currentWriter.name}!
              </span>
              <Link to={`/blog/${currentWriter._id}/write`}>
                <Button variant="primary">
                  ✏️ Write Blog
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                onClick={handleLogout}
              >
                🚪 Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth/sign-in">
                <Button variant="outline">
                  🔑 Sign In
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button variant="primary">
                  ✍️ Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
