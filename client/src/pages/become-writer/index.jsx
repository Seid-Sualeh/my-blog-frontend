import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectWriterId } from '../../store/slices/authSlice';
import Card from '../../components/card/card';
import Button from '../../components/button/button';
import './become-writer.css';

const BecomeWriter = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const writerId = useSelector(selectWriterId);

  return (
    <div className="become-writer-container">
      {/* Banner Section */}
      <div className="become-writer-banner">
        <div className="banner-image">
          <img src="/images/tech-blog-1.jpg" alt="Writer Community Banner" />
          <div className="banner-overlay">
            <div className="banner-content">
              <h1>🌟 Join Our Writing Community</h1>
              <p>Where every story finds its audience and every voice matters</p>
              <div className="banner-stats">
                <div className="stat">
                  <span className="stat-number">1,000+</span>
                  <span className="stat-label">Active Writers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">10,000+</span>
                  <span className="stat-label">Published Articles</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50,000+</span>
                  <span className="stat-label">Monthly Readers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="become-writer-hero">
        <h2>Transform Your Ideas Into Stories</h2>
        <p>Join thousands of writers who are already making their mark in the digital world</p>
      </div>

      <div className="become-writer-content">
        <Card className="writer-info-card">
          <h2>Why Join Our Writing Community?</h2>
          <ul className="benefits-list">
            <li>✍️ Share your unique voice and perspectives</li>
            <li>🌍 Reach a diverse and engaged audience</li>
            <li>📚 Build your writing portfolio</li>
            <li>🤝 Connect with fellow writers and readers</li>
            <li>📈 Track your blog post performance</li>
            <li>🎯 Control your content and publishing schedule</li>
          </ul>
        </Card>

        <Card className="writer-process-card">
          <h2>Getting Started</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Account</h3>
                <p>Sign up with your email and create a secure password</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Set Up Your Profile</h3>
                <p>Add your name, bio, and any other details you'd like to share</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Write Your First Post</h3>
                <p>Use our editor to craft your first amazing blog post</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Publish & Share</h3>
                <p>Share your post with the world and engage with your readers</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="writer-cta-card">
          <h2>Ready to Start Writing?</h2>
          <p>Join thousands of writers who are already sharing their stories on our platform.</p>
          
          {isAuthenticated && writerId ? (
            <div className="authenticated-actions">
              <p>You're already signed in! Start writing your first blog post.</p>
              <Link to={`/blog/${writerId}/write`}>
                <Button variant="primary" size="large">✍️ Start Writing</Button>
              </Link>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/auth/sign-up">
                <Button variant="primary">Sign Up Now</Button>
              </Link>
              <span className="divider">or</span>
              <Link to="/auth/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card className="writer-guidelines-card">
          <h2>Writing Guidelines</h2>
          <div className="guidelines">
            <div className="guideline">
              <h3>📝 Original Content</h3>
              <p>All blog posts must be your original work. Plagiarism is strictly prohibited.</p>
            </div>
            <div className="guideline">
              <h3>🎯 Relevant Topics</h3>
              <p>Focus on topics that provide value to our readers. Stay on point and be informative.</p>
            </div>
            <div className="guideline">
              <h3>💬 Respectful Communication</h3>
              <p>Maintain a respectful tone in all your posts and interactions with readers.</p>
            </div>
            <div className="guideline">
              <h3>📊 Regular Updates</h3>
              <p>While there's no strict posting schedule, consistent activity is encouraged.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BecomeWriter;