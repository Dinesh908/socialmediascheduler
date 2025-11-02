import React, { useState } from 'react';
import { postsAPI } from '../api';

const PostForm = ({ post, onSuccess, onCancel }) => {
  const [content, setContent] = useState(post?.content || '');
  const [mediaUrl, setMediaUrl] = useState(post?.media_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (post) {
        await postsAPI.update(post.id, { content, media_url: mediaUrl });
      } else {
        await postsAPI.create({ content, media_url: mediaUrl });
      }
      setContent('');
      setMediaUrl('');
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Failed to save post');
      }
    } finally {
      setLoading(false);
    }
  };

  if (post && onCancel) {
    return (
      <div className="form-container">
        <h2>Edit Post</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="What's on your mind?"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mediaUrl">Media URL (optional)</label>
            <input
              type="url"
              id="mediaUrl"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update Post'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Create New Post</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="What's on your mind?"
          />
        </div>
        <div className="form-group">
          <label htmlFor="mediaUrl">Media URL (optional)</label>
          <input
            type="url"
            id="mediaUrl"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
