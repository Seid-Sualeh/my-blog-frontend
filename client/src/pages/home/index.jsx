import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllBlogsQuery, useDeleteBlogMutation } from "../../store/api/blogApi";
import { selectIsAuthenticated, selectWriterId } from "../../store/slices/authSlice";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import Card from "../../components/card/card";
import Button from "../../components/button/button";
import { formatDate, truncateText } from "../../utils/helpers/index";
import axios from "axios";
import { API_CONFIG } from "../../utils/configs/api-config";
import "./home.css";

const Home = () => {
  const { data: blogsData, isLoading, error, refetch } = useGetAllBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [directBlogs, setDirectBlogs] = React.useState([]);
  const [directLoading, setDirectLoading] = React.useState(false);
  const [directError, setDirectError] = React.useState(null);
  
  // Filter states
  const [category, setCategory] = useState("all");
  const [articleType, setArticleType] = useState("all");
  const [search, setSearch] = useState("");
  
  // Authentication state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const writerId = useSelector(selectWriterId);
  const navigate = useNavigate();

  // Helper function to get appropriate image for blog
  const getBlogImage = (blog) => {
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
  
  // Direct API connection as fallback
  const fetchBlogsDirectly = async () => {
    setDirectLoading(true);
    setDirectError(null);
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOGS}`);
      const blogs = response.data?.data?.blogs || [];
      setDirectBlogs(blogs);
    } catch (apiError) {
      setDirectError(apiError.message || 'Failed to fetch blogs');
    } finally {
      setDirectLoading(false);
    }
  };
  
  // Auto-fetch on component mount
  useEffect(() => {
    fetchBlogsDirectly();
  }, []);

  // Extract unique categories from blog tags
  const availableCategories = useMemo(() => {
    const allTags = displayBlogs
      .filter(blog => blog.isPublished && blog.tags)
      .flatMap(blog => blog.tags);
    const uniqueTags = [...new Set(allTags)].sort();
    return ["all", ...uniqueTags];
  }, [displayBlogs]);

  // Filtered blogs logic
  const filteredBlogs = useMemo(() => {
    if (!displayBlogs || displayBlogs.length === 0) return [];

    let result = displayBlogs.filter((blog) => blog.isPublished);

    // Apply search filter
    const searchLower = search.trim().toLowerCase();
    if (searchLower) {
      result = result.filter(
        (blog) =>
          (blog.title && blog.title.toLowerCase().includes(searchLower)) ||
          (blog.content && blog.content.toLowerCase().includes(searchLower)) ||
          (blog.writer &&
            blog.writer.name &&
            blog.writer.name.toLowerCase().includes(searchLower)) ||
          (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Apply category filter
    if (category !== "all") {
      result = result.filter(
        (blog) =>
          blog.tags && blog.tags.includes(category)
      );
    }

    // Apply article type filter
    if (articleType === "popular") {
      // Sort by readTime (estimated by content length) for popular articles
      result.sort((a, b) => (b.content?.length || 0) - (a.content?.length || 0));
    } else if (articleType === "recent") {
      // Sort by createdAt descending for recent articles
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [displayBlogs, category, articleType, search]);

  const handleDeleteBlog = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteBlog(blogId).unwrap();
      // Refresh both data sources after deletion
      refetch();
      fetchBlogsDirectly();
    } catch (error) {
      alert('Failed to delete blog post: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEditBlog = (blogId) => {
    navigate(`/blog/${writerId}/write?edit=${blogId}`);
  };
  
  // RTK Query data
  const blogs = blogsData?.blogs || [];
  
  // Use direct data if RTK Query fails
  const displayBlogs = directBlogs.length > 0 ? directBlogs : blogs;
  const isDisplayLoading = isLoading || directLoading;
  const displayError = error || directError;

  // Data is fetched via RTK Query hook above (`useGetAllBlogsQuery`).
  // If you need writers data here, use `useGetAllWritersQuery()` from the API slice.

  // Filter only published blogs for the home page
  const publishedBlogs = displayBlogs.filter((blog) => blog.isPublished);
  
  if (isLoading) {
    return <LoadingSpinner text="Loading blog posts..." />;
  }

  if (displayError) {
    return (
      <div className="home-container">
        <Card className="error-card">
          <h2>Error Loading Blogs</h2>
          <p>{displayError.message || displayError || "Failed to load blog posts"}</p>
          <p><strong>API URL:</strong> {`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOGS}`}</p>
          <div style={{marginTop: '12px'}}>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
            <Button variant="outline" onClick={() => {refetch(); fetchBlogsDirectly();}}>Retry Both Methods</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isDisplayLoading) {
    return <LoadingSpinner text="Loading blog posts..." />;
  }

  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-banner">
          <img src="/images/tech-blog-1.jpg" alt="Blog Platform Banner" className="banner-image" />
          <div className="hero-content">
            <h1>Welcome to Our Blog Platform</h1>
            <p>Discover amazing stories from our talented writers</p>
          </div>
        </div>
      </div>

      <div className="blog-section">
        <h2>Latest Blog Posts</h2>

        {publishedBlogs.length === 0 ? (
          <Card className="empty-state">
            <h3>No blog posts available yet</h3>
            <p>Be the first to share your thoughts with our community!</p>
            <div style={{marginTop: '12px'}}>
              <Link to="/become-a-writer">
                <Button>Become a Writer</Button>
              </Link>
              <Button variant="outline" onClick={fetchBlogsDirectly} style={{marginLeft: '8px'}}>Refresh Blogs</Button>
            </div>
          </Card>
        ) : (
          <div className="blog-grid">
            {publishedBlogs.map((blog) => {
              const isAuthor = isAuthenticated && blog.writer?._id === writerId;
              
              return (
                <Card key={blog._id} className="blog-card">
                  <div className="blog-image-container">
                    <img 
                      src={blog.image || getBlogImage(blog)} 
                      alt={blog.title} 
                      className="blog-image"
                    />
                  </div>
                  <div className="blog-card-header">
                    <h3>
                      <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                    </h3>
                  </div>

                  <div className="blog-meta">
                    <span className="author">
                      By {blog.writer?.name || "Unknown"}
                    </span>
                    <span className="date">{formatDate(blog.createdAt)}</span>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-tags">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag}
                        </span>
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
                    {isAuthor && (
                      <div className="blog-actions" style={{marginLeft: '8px'}}>
                        <Button 
                          size="small" 
                          variant="outline" 
                          onClick={() => handleEditBlog(blog._id)}
                          style={{marginRight: '8px'}}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          variant="danger" 
                          onClick={() => handleDeleteBlog(blog._id, blog.title)}
                          disabled={isDeleting}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
