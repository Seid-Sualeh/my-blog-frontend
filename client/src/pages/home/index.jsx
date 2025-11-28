import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllBlogsQuery } from '../../store/api/blogApi';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import Card from '../../components/card/card';
import Button from '../../components/button/button';
import { formatDate, truncateText } from '../../utils/helpers/index';
import './home.css';
import axios from 'axios';
import { API_CONFIG } from '../../utils/configs/api-config';

// Test function for debugging
const testDirectAPI = async () => {
  try {
    console.log('Testing direct API call to:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOGS}`);
    const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOGS}`);
    console.log('Direct API Response:', response.data);
  } catch (apiError) {
    console.error('Direct API Error:', apiError);
    console.error('Error details:', apiError.response?.data || apiError.message);
  }
};

const Home = () => {
  const { data: blogsData, isLoading, error } = useGetAllBlogsQuery();
  const blogs = blogsData?.blogs || [];
  
  console.log('=== HOME PAGE DEBUG ===');
  console.log('blogsData:', blogsData);
  console.log('blogs:', blogs);
  console.log('isLoading:', isLoading);
  console.log('error:', error);
  console.log('publishedBlogs:', blogs.filter(blog => blog.isPublished));
  
  // Direct API test
  useEffect(() => {
    testDirectAPI();
  }, []);

  // Filter only published blogs for the home page
  const publishedBlogs = blogs.filter(blog => blog.isPublished);

  if (isLoading) {
    return <LoadingSpinner text="Loading blog posts..." />;
  }

  if (error) {
    console.error('Home page error details:', error);
    return (
      <div className="home-container">
        <Card className="error-card">
          <h2>Error Loading Blogs</h2>
          <p>{error.message || 'Failed to load blog posts'}</p>
          <p><strong>Error Details:</strong> {error.status || 'Unknown status'}</p>
          <p><strong>API URL:</strong> {`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOGS}`}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button variant="outline" onClick={() => testDirectAPI()}>Test API Connection</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Welcome to Our Blog Platform</h1>
        <p>Discover amazing stories from our talented writers</p>
      </div>

      <div className="blog-section">
        <h2>Latest Blog Posts</h2>
        
        {publishedBlogs.length === 0 ? (
          <Card className="empty-state">
            <h3>No blog posts available yet</h3>
            <p>Be the first to share your thoughts with our community!</p>
            <Link to="/become-a-writer">
              <Button>Become a Writer</Button>
            </Link>
          </Card>
        ) : (
          <div className="blog-grid">
            {publishedBlogs.map((blog) => (
              <Card key={blog._id} className="blog-card">
                <div className="blog-card-header">
                  <h3>
                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                  </h3>
                </div>
                
                <div className="blog-meta">
                  <span className="author">By {blog.writer?.name || 'Unknown'}</span>
                  <span className="date">{formatDate(blog.createdAt)}</span>
                </div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-tags">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="blog-excerpt">
                  <p>{truncateText(blog.content, 150)}</p>
                </div>

                <div className="blog-card-footer">
                  <Link to={`/blog/${blog._id}`}>
                    <Button variant="outline">Read More</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
