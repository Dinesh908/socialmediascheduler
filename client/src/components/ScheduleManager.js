import React, { useState, useEffect } from 'react';
import { schedulesAPI, postsAPI } from '../api';

const ScheduleManager = () => {
  const [posts, setPosts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    post_id: '',
    platform: 'facebook',
    scheduled_time: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsRes, schedulesRes] = await Promise.all([
        postsAPI.getAll(),
        schedulesAPI.getAll(),
      ]);
      setPosts(postsRes.data);
      setSchedules(schedulesRes.data);
      setError('');
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await schedulesAPI.create(formData);
      setFormData({ post_id: '', platform: 'facebook', scheduled_time: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Failed to create schedule');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await schedulesAPI.delete(id);
      fetchData();
    } catch (err) {
      setError('Failed to delete schedule');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await schedulesAPI.update(id, { status });
      fetchData();
    } catch (err) {
      setError('Failed to update schedule status');
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: '👤',
      twitter: '🐦',
      instagram: '📷',
    };
    return icons[platform] || '📱';
  };

  if (loading) {
    return <div className="loading">Loading schedules...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#333' }}>Schedule Posts</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Schedule'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="form-container" style={{ marginBottom: '30px' }}>
          <h3>Create Schedule</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="post_id">Select Post *</label>
              <select
                id="post_id"
                value={formData.post_id}
                onChange={(e) => setFormData({ ...formData, post_id: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '6px', fontSize: '1rem' }}
              >
                <option value="">-- Select a post --</option>
                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.content.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="platform">Platform *</label>
              <select
                id="platform"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '6px', fontSize: '1rem' }}
              >
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="scheduled_time">Scheduled Time *</label>
              <input
                type="datetime-local"
                id="scheduled_time"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Schedule
            </button>
          </form>
        </div>
      )}

      {schedules.length === 0 ? (
        <div className="empty-state">
          <h3>No scheduled posts</h3>
          <p>Create a schedule to get started!</p>
        </div>
      ) : (
        <div>
          {schedules.map((schedule) => (
            <div key={schedule.id} className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    {getPlatformIcon(schedule.platform)} {schedule.platform.toUpperCase()}
                    <span className={`platform-badge platform-${schedule.platform}`} style={{ marginLeft: '10px' }}>
                      {schedule.platform}
                    </span>
                    <span className={`status-badge status-${schedule.status}`} style={{ marginLeft: '10px' }}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
                <div className="card-actions">
                  {schedule.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() => handleStatusUpdate(schedule.id, 'published')}
                        style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                      >
                        Mark Published
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(schedule.id)}
                    style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="card-content">
                <strong>Post:</strong> {schedule.content}
              </div>
              {schedule.media_url && (
                <div style={{ marginBottom: '15px', color: '#667eea' }}>
                  📎 <a href={schedule.media_url} target="_blank" rel="noopener noreferrer">{schedule.media_url}</a>
                </div>
              )}
              <div className="card-footer">
                <span>Scheduled: {new Date(schedule.scheduled_time).toLocaleString()}</span>
                {schedule.published_at && (
                  <span>Published: {new Date(schedule.published_at).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
