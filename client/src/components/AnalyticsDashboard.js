import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../api';
import AnalyticsForm from './AnalyticsForm';

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, analyticsRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getAll(),
      ]);
      setDashboardData(dashboardRes.data);
      setAnalytics(analyticsRes.data);
      setError('');
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Failed to load analytics data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedSchedule(null);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedSchedule(null);
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
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#333' }}>Analytics Dashboard</h2>
        {showForm ? (
          <button className="btn btn-secondary" onClick={handleFormCancel}>
            Cancel
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Analytics
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <AnalyticsForm
          schedule={selectedSchedule}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {dashboardData && (
        <>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Summary</h3>
          <div className="grid grid-3" style={{ marginBottom: '30px' }}>
            <div className="stat-card">
              <h3>{dashboardData.totalPosts}</h3>
              <p>Total Posts</p>
            </div>
            <div className="stat-card">
              <h3>{dashboardData.totalSchedules}</h3>
              <p>Total Schedules</p>
            </div>
            <div className="stat-card">
              <h3>{dashboardData.totalEngagement.total_likes || 0}</h3>
              <p>Total Likes</p>
            </div>
            <div className="stat-card">
              <h3>{dashboardData.totalEngagement.total_shares || 0}</h3>
              <p>Total Shares</p>
            </div>
            <div className="stat-card">
              <h3>{dashboardData.totalEngagement.total_comments || 0}</h3>
              <p>Total Comments</p>
            </div>
            <div className="stat-card">
              <h3>{dashboardData.totalEngagement.total_views || 0}</h3>
              <p>Total Views</p>
            </div>
            <div className="stat-card">
              <h3>{dashboardData.totalEngagement.total_clicks || 0}</h3>
              <p>Total Clicks</p>
            </div>
            <div className="stat-card">
              <h3>{(dashboardData.totalEngagement.avg_engagement_rate || 0).toFixed(2)}%</h3>
              <p>Avg Engagement Rate</p>
            </div>
          </div>

          {dashboardData.engagementByPlatform && dashboardData.engagementByPlatform.length > 0 && (
            <>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Engagement by Platform</h3>
              <div className="grid grid-3" style={{ marginBottom: '30px' }}>
                {dashboardData.engagementByPlatform.map((platformData) => (
                  <div key={platformData.platform} className="card">
                    <h4 style={{ marginBottom: '15px' }}>
                      {getPlatformIcon(platformData.platform)} {platformData.platform.toUpperCase()}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div><strong>Likes:</strong> {platformData.total_likes || 0}</div>
                      <div><strong>Shares:</strong> {platformData.total_shares || 0}</div>
                      <div><strong>Comments:</strong> {platformData.total_comments || 0}</div>
                      <div><strong>Views:</strong> {platformData.total_views || 0}</div>
                      <div><strong>Clicks:</strong> {platformData.total_clicks || 0}</div>
                      <div><strong>Engagement Rate:</strong> {(platformData.avg_engagement_rate || 0).toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <h3 style={{ marginBottom: '20px', color: '#333' }}>Analytics Records</h3>
      {analytics.length === 0 ? (
        <div className="empty-state">
          <h3>No analytics data yet</h3>
          <p>Add analytics for your scheduled posts to track engagement!</p>
        </div>
      ) : (
        <div>
          {analytics.map((record) => (
            <div key={record.id} className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    {getPlatformIcon(record.platform)} {record.platform.toUpperCase()}
                    <span className={`platform-badge platform-${record.platform}`} style={{ marginLeft: '10px' }}>
                      {record.platform}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <strong>Post:</strong> {record.content?.substring(0, 100)}...
              </div>
              <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                <div><strong>Likes:</strong> {record.likes}</div>
                <div><strong>Shares:</strong> {record.shares}</div>
                <div><strong>Comments:</strong> {record.comments}</div>
                <div><strong>Views:</strong> {record.views}</div>
                <div><strong>Clicks:</strong> {record.clicks}</div>
                <div><strong>Engagement Rate:</strong> {record.engagement_rate?.toFixed(2)}%</div>
              </div>
              <div className="card-footer">
                <span>Recorded: {new Date(record.recorded_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
