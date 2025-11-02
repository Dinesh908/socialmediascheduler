import React, { useState } from 'react';
import './App.css';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import ScheduleManager from './components/ScheduleManager';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="App">
      <header className="app-header">
        <h1>📱 Social Media Scheduler</h1>
        <p>Schedule posts across Facebook, Twitter, and Instagram</p>
      </header>

      <nav className="tab-navigation">
        <button 
          className={activeTab === 'posts' ? 'active' : ''} 
          onClick={() => setActiveTab('posts')}
        >
          📝 Posts
        </button>
        <button 
          className={activeTab === 'schedule' ? 'active' : ''} 
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''} 
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'posts' && (
          <div className="posts-container">
            <PostForm />
            <PostList />
          </div>
        )}
        {activeTab === 'schedule' && <ScheduleManager />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>
    </div>
  );
}

export default App;