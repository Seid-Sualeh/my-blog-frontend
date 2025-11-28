import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from "../../store/api/blogApi";
import { selectWriterId, selectCurrentWriter } from '../../store/slices/authSlice';
import Card from '../../components/card/card';
import Button from '../../components/button/button';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import './write-blog.css';

const WriteBlog = () => {
  const { writerId: urlWriterId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const writerId = useSelector(selectWriterId);
  const currentWriter = useSelector(selectCurrentWriter);
  const editBlogId = searchParams.get('edit');

  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    tags: '',
    isPublished: false,
  });

  const [draftData, setDraftData] = useState({
    title: '',
    content: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  // Fetch blog data if editing
  const { data: blogResponse, isLoading: blogLoading } = useGetBlogByIdQuery(
    editBlogId, 
    { skip: !editBlogId }
  );

  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();

  const isLoading = blogLoading || creating || updating;
  const isEditing = !!editBlogId;

  // Load draft from localStorage on component mount
  useEffect(() => {
    const draftKey = `blog-draft-${writerId || urlWriterId}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setDraftData(parsedDraft);
        // Auto-load draft into form if form is empty
        if (!blogData.title && !blogData.content) {
          setBlogData({
            ...blogData,
            title: parsedDraft.title || '',
            content: parsedDraft.content || '',
            tags: parsedDraft.tags || '',
          });
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [writerId, urlWriterId, blogData.title, blogData.content]);

  // Load blog data if editing
  useEffect(() => {
    if (blogResponse?.blog && isEditing) {
      const blog = blogResponse.blog;
      setBlogData({
        title: blog.title || '',
        content: blog.content || '',
        tags: blog.tags ? blog.tags.join(', ') : '',
        isPublished: blog.isPublished || false,
      });
    }
  }, [blogResponse, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setBlogData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-save draft to localStorage
    saveDraftToLocalStorage({
      ...blogData,
      [name]: newValue
    });
  };

  const saveDraftToLocalStorage = (data) => {
    try {
      const draftKey = `blog-draft-${writerId || urlWriterId}`;
      const draftInfo = {
        title: data.title,
        content: data.content,
        tags: data.tags,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftInfo));
      setSaveMessage('Draft saved automatically');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleSaveDraft = () => {
    saveDraftToLocalStorage(blogData);
    setSaveMessage('Draft saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!blogData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!blogData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (blogData.content.trim().length < 50) {
      newErrors.content = 'Content must be at least 50 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const blogPayload = {
        title: blogData.title.trim(),
        content: blogData.content.trim(),
        tags: blogData.tags ? blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        isPublished: true,
        writer: writerId || urlWriterId,
      };

      if (isEditing) {
        await updateBlog({
          id: editBlogId,
          ...blogPayload,
        }).unwrap();
        setSaveMessage('Blog post updated and published successfully!');
      } else {
        await createBlog(blogPayload).unwrap();
        setSaveMessage('Blog post created and published successfully!');
      }

      // Clear draft
      const draftKey = `blog-draft-${writerId || urlWriterId}`;
      localStorage.removeItem(draftKey);

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setErrors({
        submit: error.data?.message || 'Failed to publish blog post. Please try again.'
      });
    }
  };

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear your draft? This action cannot be undone.')) {
      setBlogData({
        title: '',
        content: '',
        tags: '',
        isPublished: false,
      });
      const draftKey = `blog-draft-${writerId || urlWriterId}`;
      localStorage.removeItem(draftKey);
      setSaveMessage('Draft cleared');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text={isEditing ? "Loading blog post..." : "Loading..."} />;
  }

  return (
    <div className="write-blog-container">
      <div className="write-blog-header">
        <h1>{isEditing ? 'Edit Blog Post' : 'Write New Blog Post'}</h1>
        <p>Welcome, {currentWriter?.name || 'Writer'}! Share your thoughts with the world.</p>
      </div>

      {saveMessage && (
        <Card className="save-message">
          <p>{saveMessage}</p>
        </Card>
      )}

      <Card className="write-blog-card">
        <form className="write-blog-form">
          <div className="form-group">
            <label htmlFor="title">Blog Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={blogData.title}
              onChange={handleInputChange}
              placeholder="Enter your blog post title..."
              className={errors.title ? 'error' : ''}
              maxLength={200}
            />
            <div className="input-help">
              <span>{blogData.title.length}/200 characters</span>
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={blogData.tags}
              onChange={handleInputChange}
              placeholder="e.g., technology, tutorial, javascript"
            />
            <div className="input-help">
              <span>Separate tags with commas to help readers find your content</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={blogData.content}
              onChange={handleInputChange}
              placeholder="Start writing your blog post here...

Tips for great content:
• Use clear headings to organize your thoughts
• Write in a conversational tone
• Include examples and practical tips
• Proofread before publishing"
              className={errors.content ? 'error' : ''}
              rows={20}
            />
            <div className="input-help">
              <span>{blogData.content.length} characters</span>
              {errors.content && <span className="error-message">{errors.content}</span>}
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="form-actions">
            <Button 
              type="button" 
              onClick={handleSaveDraft}
              variant="outline"
            >
              💾 Save Draft
            </Button>
            
            <Button 
              type="button" 
              onClick={handleClearDraft}
              variant="secondary"
            >
              🗑️ Clear Draft
            </Button>
            
            <Button 
              type="button" 
              onClick={handlePublish}
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : '🚀 Publish Post'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default WriteBlog;