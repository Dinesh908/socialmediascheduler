import React, { useState, useEffect } from 'react';
import { postsAPI } from '../api';
import PostForm from './PostForm';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll();
      setPosts(response.data);
      setError('');
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Failed to load posts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsAPI.delete(id);
      fetchPosts();
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleUpdateSuccess = () => {
    setEditingPost(null);
    fetchPosts();
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Your Posts</h2>
      {error && <div className="error">{error}</div>}
      
      {editingPost && (
        <PostForm post={editingPost} onSuccess={handleUpdateSuccess} onCancel={handleCancelEdit} />
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Create your first post above!</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="card-header">
                <div className="card-title">Post #{posts.indexOf(post) + 1}</div>
                <div className="card-actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(post)}
                    style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(post.id)}
                    style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="card-content">{post.content}</div>
              {post.media_url && (
                <div style={{ marginBottom: '15px' }}>
                  <a href={post.media_url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                    📎 {post.media_url}
                  </a>
                </div>
              )}
              <div className="card-footer">
                <span>Created: {new Date(post.created_at).toLocaleString()}</span>
                {post.updated_at !== post.created_at && (
                  <span>Updated: {new Date(post.updated_at).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
