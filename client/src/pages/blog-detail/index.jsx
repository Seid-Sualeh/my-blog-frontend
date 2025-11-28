import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetBlogByIdQuery } from '../../store/api/blogApi';
import { selectIsAuthenticated, selectWriterId } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import Card from '../../components/card/card';
import Button from '../../components/button/button';
import { formatDate } from '../../utils/helpers/index';
import './blog-detail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const writerId = useSelector(selectWriterId);
  
  const { data: blogData, isLoading, error } = useGetBlogByIdQuery(id);
  const blog = blogData?.blog;

  // Check if the current user is the author of this blog
  const isAuthor = blog && isAuthenticated && blog.writer?._id === writerId;

  if (isLoading) {
    return <LoadingSpinner text="Loading blog post..." />;
  }

  if (error) {
    return (
      <div className="blog-detail-container">
        <Card className="error-card">
          <h2>Blog Post Not Found</h2>
          <p>{error.message || 'The requested blog post could not be found.'}</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-container">
        <Card className="error-card">
          <h2>Blog Post Not Found</h2>
          <p>The requested blog post does not exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-header">
        <Link to="/" className="back-link">
          ← Back to Blogs
        </Link>
      </div>

      <Card className="blog-detail-card">
        <article className="blog-article">
          <header className="blog-header">
            <h1>{blog.title}</h1>
            
            <div className="blog-meta">
              <div className="author-info">
                <span className="author">By {blog.writer?.name || 'Unknown Writer'}</span>
                {blog.writer?.email && (
                  <span className="author-email">{blog.writer.email}</span>
                )}
              </div>
              <div className="publish-info">
                <span className="date">Published on {formatDate(blog.createdAt)}</span>
                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                  <span className="updated-date">Updated on {formatDate(blog.updatedAt)}</span>
                )}
              </div>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-tags">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            )}

            <div className="blog-status">
              {blog.isPublished ? (
                <span className="status published">Published</span>
              ) : (
                <span className="status draft">Draft</span>
              )}
            </div>
          </header>

          <div className="blog-content">
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index}>{paragraph}</p>
              )
            ))}
          </div>

          {isAuthor && (
            <footer className="blog-actions">
              <Button 
                onClick={() => navigate(`/blog/${writerId}/write?edit=${blog._id}`)}
                variant="primary"
              >
                Edit Blog
              </Button>
              <Button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this blog post?')) {
                    // TODO: Implement delete functionality
                    console.log('Delete blog:', blog._id);
                  }
                }}
                variant="danger"
              >
                Delete Blog
              </Button>
            </footer>
          )}
        </article>
      </Card>
    </div>
  );
};

export default BlogDetail;