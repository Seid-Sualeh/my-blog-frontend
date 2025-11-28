import React from "react";
import Card from "../../../components/card/card";
import Button from "../../../components/button/button";
import { truncateText, formatRelativeTime } from "../../../utils/helpers";
import "./blog-list.css";

const BlogList = ({
  blogs,
  onViewBlog,
  onEditBlog,
  onDeleteBlog,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="blog-list-loading">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <Card className="blog-list-empty">
        <div className="empty-state">
          <h3>No blogs yet</h3>
          <p>Be the first to share your story!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <Card key={blog._id} className="blog-card" hover={true}>
          <div className="blog-header">
            <h3 className="blog-title">{blog.title}</h3>
            {blog.isPublished ? (
              <span className="blog-status published">Published</span>
            ) : (
              <span className="blog-status draft">Draft</span>
            )}
          </div>

          <div className="blog-meta">
            <span className="blog-author">
              By {blog.writer?.name || "Unknown Author"}
            </span>
            <span className="blog-date">
              {formatRelativeTime(blog.createdAt)}
            </span>
          </div>

          <p className="blog-excerpt">
            {blog.excerpt || truncateText(blog.content, 200)}
          </p>

          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              {blog.tags.map((tag, index) => (
                <span key={index} className="blog-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="blog-actions">
            <a 
              href={`/blog/${blog._id}`} 
              className="learn-more-link"
              onClick={(e) => {
                e.preventDefault();
                onViewBlog(blog);
              }}
            >
              Learn More →
            </a>
            <div className="blog-action-buttons">
              <Button
                variant="secondary"
                size="small"
                onClick={() => onEditBlog(blog)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => onDeleteBlog(blog._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BlogList;
