import React, { useState, useEffect } from "react";
import Button from "../../../components/button/button";
import Card from "../../../components/card/card";
import { getWriters } from "../../../service/blog/get-writers";
import "./blog-form.css";

const BlogForm = ({ onSubmit, onCancel, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    isPublished: false,
    writer: "",
  });
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        excerpt: initialData.excerpt || "",
        tags: initialData.tags ? initialData.tags.join(", ") : "",
        isPublished: initialData.isPublished || false,
        writer: initialData.writer?._id || initialData.writer || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchWriters();
  }, []);

  const fetchWriters = async () => {
    try {
      const response = await getWriters();
      setWriters(response.data.writers);
    } catch (err) {
      setError("Failed to load writers");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      await onSubmit(submitData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="blog-form-container">
      <h2>{isEditing ? "Edit Blog Post" : "Write New Blog Post"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter blog title..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="writer">Author *</label>
          <select
            id="writer"
            name="writer"
            value={formData.writer}
            onChange={handleChange}
            required
          >
            <option value="">Select an author</option>
            {writers.map((writer) => (
              <option key={writer._id} value={writer._id}>
                {writer.name} ({writer.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            placeholder="Brief description of your blog post..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
            placeholder="Write your blog content here..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="technology, programming, web-development (comma separated)"
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            Publish immediately
          </label>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default BlogForm;
