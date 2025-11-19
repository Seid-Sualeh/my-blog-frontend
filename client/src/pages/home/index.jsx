import React, { useState, useEffect } from "react";
import Header from "../../layouts/common/header/header";
import BlogList from "../../layouts/home/blog-list/blog-list";
import BlogForm from "../../layouts/home/blog-form/blog-form";
import WriterList from "../../layouts/home/writer-list/writer-list";
import WriterForm from "../../layouts/home/writer-form/writer-form";
import Modal from "../../components/modal/modal";
import Card from "../../components/card/card";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import getBlogs from "../../service/blog/get-all-blogs";
import { createBlog } from "../../service/blog/create-blog";
import { updateBlog } from "../../service/blog/update-blog";
import { deleteBlog } from "../../service/blog/delete-blog";
import { getWriters } from "../../service/blog/get-writers";
import { createWriter } from "../../service/blog/create-writer";
import { updateWriter } from "../../service/blog/update-writer";
import { deleteWriter } from "../../service/blog/delete-writer";
import Footer from "../../layouts/common/footer/footer";
import "./home.css";

const Home = () => {
  // State management
  const [blogs, setBlogs] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showWriterForm, setShowWriterForm] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingWriter, setEditingWriter] = useState(null);

  // Active tab state
  const [activeTab, setActiveTab] = useState("blogs");

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [blogsResponse, writersResponse] = await Promise.all([
        getBlogs(),
        getWriters(),
      ]);

      setBlogs(blogsResponse.data.blogs || []);
      setWriters(writersResponse.data.writers || []);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Blog handlers
  const handleCreateBlog = async (blogData) => {
    await createBlog(blogData);
    setShowBlogForm(false);
    fetchData(); // Refresh data
  };

  const handleUpdateBlog = async (blogData) => {
    await updateBlog(editingBlog._id, blogData);
    setShowBlogForm(false);
    setEditingBlog(null);
    fetchData(); // Refresh data
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await deleteBlog(blogId);
      fetchData(); // Refresh data
    }
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowBlogForm(true);
  };

  // Writer handlers
  const handleCreateWriter = async (writerData) => {
    await createWriter(writerData);
    setShowWriterForm(false);
    fetchData(); // Refresh data
  };

  const handleUpdateWriter = async (writerData) => {
    await updateWriter(editingWriter._id, writerData);
    setShowWriterForm(false);
    setEditingWriter(null);
    fetchData(); // Refresh data
  };

  const handleDeleteWriter = async (writerId) => {
    if (window.confirm("Are you sure you want to delete this writer?")) {
      await deleteWriter(writerId);
      fetchData(); // Refresh data
    }
  };

  const handleEditWriter = (writer) => {
    setEditingWriter(writer);
    setShowWriterForm(true);
  };

  // Modal handlers
  const handleCloseBlogForm = () => {
    setShowBlogForm(false);
    setEditingBlog(null);
  };

  const handleCloseWriterForm = () => {
    setShowWriterForm(false);
    setEditingWriter(null);
  };

  if (loading && blogs.length === 0 && writers.length === 0) {
    return (
      <div className="home-container">
        <LoadingSpinner text="Loading blog platform..." />
      </div>
    );
  }

  return (
    <div className="home-container">
      <Header
        onShowBlogForm={() => setShowBlogForm(true)}
        onShowWriterForm={() => setShowWriterForm(true)}
      />

      {error && (
        <Card className="error-banner">
          <p>{error}</p>
          <button onClick={fetchData}>Retry</button>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "blogs" ? "active" : ""}`}
          onClick={() => setActiveTab("blogs")}
        >
          📝 Blogs ({blogs.length})
        </button>
        <button
          className={`tab-button ${activeTab === "writers" ? "active" : ""}`}
          onClick={() => setActiveTab("writers")}
        >
          👤 Writers ({writers.length})
        </button>
      </div>

      {/* Content Area */}
      <main className="main-content">
        {activeTab === "blogs" && (
          <BlogList
            blogs={blogs}
            onViewBlog={handleViewBlog}
            onEditBlog={handleEditBlog}
            onDeleteBlog={handleDeleteBlog}
            isLoading={loading}
          />
        )}

        {activeTab === "writers" && (
          <WriterList
            writers={writers}
            onEditWriter={handleEditWriter}
            onDeleteWriter={handleDeleteWriter}
            isLoading={loading}
          />
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showBlogForm}
        onClose={handleCloseBlogForm}
        title={editingBlog ? "Edit Blog Post" : "Write New Blog Post"}
        size="large"
      >
        <BlogForm
          onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
          onCancel={handleCloseBlogForm}
          initialData={editingBlog}
          isEditing={!!editingBlog}
        />
      </Modal>

      <Modal
        isOpen={showWriterForm}
        onClose={handleCloseWriterForm}
        title={editingWriter ? "Edit Writer" : "Add New Writer"}
        size="medium"
      >
        <WriterForm
          onSubmit={editingWriter ? handleUpdateWriter : handleCreateWriter}
          onCancel={handleCloseWriterForm}
          initialData={editingWriter}
          isEditing={!!editingWriter}
        />
      </Modal>

      <Modal
        isOpen={showBlogModal}
        onClose={() => setShowBlogModal(false)}
        title={selectedBlog?.title}
        size="large"
      >
        {selectedBlog && (
          <div className="blog-detail">
            <div className="blog-meta">
              <span className="author">By {selectedBlog.writer?.name}</span>
              <span className="date">
                {new Date(selectedBlog.createdAt).toLocaleDateString()}
              </span>
              {selectedBlog.isPublished && (
                <span className="status published">Published</span>
              )}
            </div>

            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="blog-tags">
                {selectedBlog.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="blog-content">
              {selectedBlog.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </Modal>
     

      <Footer />
    </div>
  );
};

export default Home;
