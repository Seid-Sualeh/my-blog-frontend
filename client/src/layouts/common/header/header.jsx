import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentWriter, logout } from '../../../store/slices/authSlice';
import Button from '../../../components/button/button';
import './header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentWriter = useSelector(selectCurrentWriter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-overlay') && !event.target.closest('.hamburger')) {
        closeMobileMenu();
      }
    };

    // Close mobile menu with Escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-logo">
            <Link to="/" onClick={closeMobileMenu}>
              <h1>📝 Blog Platform</h1>
              <p>Share your stories with the world</p>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="header-nav desktop-nav">
            <Link to="/" className="nav-link">
              🏠 Home
            </Link>
            <Link to="/become-a-writer" className="nav-link">
              ✍️ Become a Writer
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="header-actions desktop-actions">
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

          {/* Mobile Hamburger Button */}
          <button 
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      >
        <nav className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
            🏠 Home
          </Link>
          <Link to="/become-a-writer" className="mobile-nav-link" onClick={closeMobileMenu}>
            ✍️ Become a Writer
          </Link>
          
          <div className="mobile-actions">
            {isAuthenticated && currentWriter ? (
              <>
                <div className="mobile-welcome">
                  Welcome, {currentWriter.name}!
                </div>
                <Link to={`/blog/${currentWriter._id}/write`} onClick={closeMobileMenu}>
                  <Button variant="primary" className="mobile-btn">
                    ✏️ Write Blog
                  </Button>
                </Link>
                <Button 
                  variant="secondary" 
                  onClick={handleLogout}
                  className="mobile-btn"
                >
                  🚪 Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/sign-in" onClick={closeMobileMenu}>
                  <Button variant="outline" className="mobile-btn">
                    🔑 Sign In
                  </Button>
                </Link>
                <Link to="/auth/sign-up" onClick={closeMobileMenu}>
                  <Button variant="primary" className="mobile-btn">
                    ✍️ Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
