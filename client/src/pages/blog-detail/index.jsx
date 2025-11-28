import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetBlogByIdQuery, useDeleteBlogMutation } from '../../store/api/blogApi';
import { selectIsAuthenticated, selectWriterId } from '../../store/slices/authSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [deleteError, setDeleteError] = useState(null);
  const blog = blogData?.blog;

  // Check if the current user is the author of this blog
  const isAuthor = blog && isAuthenticated && blog.writer?._id === writerId;

  // Helper function to get appropriate image for blog detail
  const getBlogDetailImage = (blog) => {
    if (blog.image) return blog.image;
    
    // Use blog ID to ensure consistent but unique images for each blog
    const blogId = blog._id || '';
    const hashCode = blogId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Available images by category
    const techImages = ['/images/tech-blog-1.jpg', '/images/tech-blog-2.jpg'];
    const travelImages = ['/images/travel-blog-1.jpg', '/images/travel-blog-2.jpg'];
    const foodImages = ['/images/food-blog-1.jpg'];
    const natureImages = ['/images/nature-blog-1.jpg'];
    const businessImages = ['/images/business-blog-1.jpg'];
    const lifestyleImages = ['/images/lifestyle-blog-1.jpg'];
    const healthImages = ['/images/health-blog-1.jpg'];
    
    // Default fallback images
    const defaultImages = [...techImages, ...travelImages, ...foodImages, ...natureImages, ...businessImages, ...lifestyleImages, ...healthImages];
    
    const tags = blog.tags || [];
    const title = blog.title.toLowerCase();
    
    // Select image based on content/tags with uniqueness
    if (tags.includes('technology') || tags.includes('tech') || title.includes('programming') || title.includes('code') || title.includes('developer')) {
      const index = Math.abs(hashCode) % techImages.length;
      return techImages[index];
    } else if (tags.includes('travel') || title.includes('travel') || title.includes('adventure') || title.includes('journey')) {
      const index = Math.abs(hashCode) % travelImages.length;
      return travelImages[index];
    } else if (tags.includes('food') || title.includes('recipe') || title.includes('cooking') || title.includes('culinary')) {
      const index = Math.abs(hashCode) % foodImages.length;
      return foodImages[index];
    } else if (tags.includes('nature') || title.includes('nature') || title.includes('outdoor') || title.includes('environment')) {
      const index = Math.abs(hashCode) % natureImages.length;
      return natureImages[index];
    } else if (tags.includes('business') || title.includes('business') || title.includes('entrepreneur') || title.includes('startup')) {
      const index = Math.abs(hashCode) % businessImages.length;
      return businessImages[index];
    } else if (tags.includes('lifestyle') || title.includes('lifestyle') || title.includes('life') || title.includes('personal')) {
      const index = Math.abs(hashCode) % lifestyleImages.length;
      return lifestyleImages[index];
    } else if (tags.includes('health') || title.includes('health') || title.includes('fitness') || title.includes('wellness')) {
      const index = Math.abs(hashCode) % healthImages.length;
      return healthImages[index];
    }
    
    // Default fallback - ensure uniqueness across blogs
    const index = Math.abs(hashCode) % defaultImages.length;
    return defaultImages[index];
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteError(null);
      await deleteBlog(id).unwrap();
      // Redirect to home page after successful deletion
      navigate('/');
    } catch (error) {
      setDeleteError(error.message || 'Failed to delete blog post');
    }
  };

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

          {(blog.image || getBlogDetailImage(blog)) && (
            <div className="blog-detail-image-container">
              <img 
                src={blog.image || getBlogDetailImage(blog)} 
                alt={blog.title} 
                className="blog-detail-image"
              />
            </div>
          )}

          <div className="blog-content">
            {blog.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content}
              </ReactMarkdown>
            ) : (
              <p>No content available for this blog post.</p>
            )}
          </div>

          {isAuthor && (
            <>
              <footer className="blog-actions">
                <Button 
                  onClick={() => navigate(`/blog/${writerId}/write?edit=${blog._id}`)}
                  variant="primary"
                >
                  Edit Blog
                </Button>
                <Button 
                  onClick={handleDelete}
                  variant="danger"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Blog'}
                </Button>
              </footer>

              {deleteError && (
                <div className="error-message" style={{marginTop: '8px', color: 'red'}}>
                  {deleteError}
                </div>
              )}
            </>
          )}
        </article>
      </Card>
    </div>
  );
};

export default BlogDetail;