import React, { useState, useEffect } from 'react';
import { analyticsAPI, schedulesAPI } from '../api';

const AnalyticsForm = ({ schedule, onSuccess, onCancel }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    schedule_id: schedule?.id || '',
    platform: schedule?.platform || '',
    likes: '',
    shares: '',
    comments: '',
    views: '',
    clicks: '',
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (schedule) {
      setFormData({
        schedule_id: schedule.id,
        platform: schedule.platform,
        likes: '',
        shares: '',
        comments: '',
        views: '',
        clicks: '',
      });
    }
  }, [schedule]);

  const fetchSchedules = async () => {
    try {
      const response = await schedulesAPI.getAll();
      setSchedules(response.data.filter(s => s.status === 'published'));
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Failed to load schedules');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const selectedSchedule = schedules.find(s => s.id === formData.schedule_id);
      await analyticsAPI.create({
        ...formData,
        platform: selectedSchedule?.platform || formData.platform,
        likes: parseInt(formData.likes) || 0,
        shares: parseInt(formData.shares) || 0,
        comments: parseInt(formData.comments) || 0,
        views: parseInt(formData.views) || 0,
        clicks: parseInt(formData.clicks) || 0,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Failed to save analytics');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (e) => {
    const scheduleId = e.target.value;
    const selectedSchedule = schedules.find(s => s.id === scheduleId);
    setFormData({
      ...formData,
      schedule_id: scheduleId,
      platform: selectedSchedule?.platform || '',
    });
  };

  return (
    <div className="form-container" style={{ marginBottom: '30px' }}>
      <h3>Add Analytics Data</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="schedule_id">Select Published Schedule *</label>
          <select
            id="schedule_id"
            value={formData.schedule_id}
            onChange={handleScheduleChange}
            required
            style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '6px', fontSize: '1rem' }}
          >
            <option value="">-- Select a schedule --</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.platform.toUpperCase()} - {s.content?.substring(0, 50)}... - {new Date(s.scheduled_time).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="likes">Likes</label>
          <input
            type="number"
            id="likes"
            value={formData.likes}
            onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
            min="0"
            placeholder="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shares">Shares</label>
          <input
            type="number"
            id="shares"
            value={formData.shares}
            onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
            min="0"
            placeholder="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <input
            type="number"
            id="comments"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            min="0"
            placeholder="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="views">Views</label>
          <input
            type="number"
            id="views"
            value={formData.views}
            onChange={(e) => setFormData({ ...formData, views: e.target.value })}
            min="0"
            placeholder="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="clicks">Clicks</label>
          <input
            type="number"
            id="clicks"
            value={formData.clicks}
            onChange={(e) => setFormData({ ...formData, clicks: e.target.value })}
            min="0"
            placeholder="0"
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Analytics'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AnalyticsForm;
