const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../database/db');

// Get all analytics
router.get('/', async (req, res) => {
  try {
    const analytics = await all(`
      SELECT a.*, s.platform, s.scheduled_time, s.status, p.content
      FROM analytics a
      JOIN schedules s ON a.schedule_id = s.id
      JOIN posts p ON s.post_id = p.id
      ORDER BY a.recorded_at DESC
    `);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics for a specific schedule
router.get('/schedule/:scheduleId', async (req, res) => {
  try {
    const analytics = await all(`
      SELECT a.*, s.platform, s.scheduled_time, s.status, p.content
      FROM analytics a
      JOIN schedules s ON a.schedule_id = s.id
      JOIN posts p ON s.post_id = p.id
      WHERE a.schedule_id = ?
      ORDER BY a.recorded_at DESC
    `, [req.params.scheduleId]);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics by platform
router.get('/platform/:platform', async (req, res) => {
  try {
    const analytics = await all(`
      SELECT a.*, s.platform, s.scheduled_time, s.status, p.content
      FROM analytics a
      JOIN schedules s ON a.schedule_id = s.id
      JOIN posts p ON s.post_id = p.id
      WHERE s.platform = ?
      ORDER BY a.recorded_at DESC
    `, [req.params.platform.toLowerCase()]);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard summary
router.get('/dashboard/summary', async (req, res) => {
  try {
    // Total posts
    const totalPosts = await get('SELECT COUNT(*) as count FROM posts');
    
    // Total schedules
    const totalSchedules = await get('SELECT COUNT(*) as count FROM schedules');
    
    // Schedules by status
    const schedulesByStatus = await all(`
      SELECT status, COUNT(*) as count 
      FROM schedules 
      GROUP BY status
    `);
    
    // Schedules by platform
    const schedulesByPlatform = await all(`
      SELECT platform, COUNT(*) as count 
      FROM schedules 
      GROUP BY platform
    `);
    
    // Total engagement metrics
    const totalEngagement = await get(`
      SELECT 
        SUM(likes) as total_likes,
        SUM(shares) as total_shares,
        SUM(comments) as total_comments,
        SUM(views) as total_views,
        SUM(clicks) as total_clicks,
        AVG(engagement_rate) as avg_engagement_rate
      FROM analytics
    `);
    
    // Engagement by platform
    const engagementByPlatform = await all(`
      SELECT 
        s.platform,
        SUM(a.likes) as total_likes,
        SUM(a.shares) as total_shares,
        SUM(a.comments) as total_comments,
        SUM(a.views) as total_views,
        SUM(a.clicks) as total_clicks,
        AVG(a.engagement_rate) as avg_engagement_rate
      FROM analytics a
      JOIN schedules s ON a.schedule_id = s.id
      GROUP BY s.platform
    `);
    
    res.json({
      totalPosts: totalPosts.count,
      totalSchedules: totalSchedules.count,
      schedulesByStatus,
      schedulesByPlatform,
      totalEngagement: totalEngagement || {
        total_likes: 0,
        total_shares: 0,
        total_comments: 0,
        total_views: 0,
        total_clicks: 0,
        avg_engagement_rate: 0
      },
      engagementByPlatform
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update analytics for a schedule
router.post('/', async (req, res) => {
  try {
    const { schedule_id, platform, likes, shares, comments, views, clicks } = req.body;
    
    if (!schedule_id || !platform) {
      return res.status(400).json({ error: 'schedule_id and platform are required' });
    }

    // Verify schedule exists
    const schedule = await get('SELECT * FROM schedules WHERE id = ?', [schedule_id]);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Calculate engagement rate
    const totalEngagement = (likes || 0) + (shares || 0) + (comments || 0);
    const engagementRate = views && views > 0 
      ? (totalEngagement / views) * 100 
      : 0;

    const id = uuidv4();
    await run(
      `INSERT INTO analytics (id, schedule_id, platform, likes, shares, comments, views, clicks, engagement_rate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        schedule_id,
        platform.toLowerCase(),
        likes || 0,
        shares || 0,
        comments || 0,
        views || 0,
        clicks || 0,
        engagementRate
      ]
    );

    const analytics = await get('SELECT * FROM analytics WHERE id = ?', [id]);
    res.status(201).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update analytics
router.put('/:id', async (req, res) => {
  try {
    const { likes, shares, comments, views, clicks } = req.body;
    const existing = await get('SELECT * FROM analytics WHERE id = ?', [req.params.id]);
    
    if (!existing) {
      return res.status(404).json({ error: 'Analytics record not found' });
    }

    const finalLikes = likes !== undefined ? likes : existing.likes;
    const finalShares = shares !== undefined ? shares : existing.shares;
    const finalComments = comments !== undefined ? comments : existing.comments;
    const finalViews = views !== undefined ? views : existing.views;
    const finalClicks = clicks !== undefined ? clicks : existing.clicks;

    const totalEngagement = finalLikes + finalShares + finalComments;
    const engagementRate = finalViews && finalViews > 0 
      ? (totalEngagement / finalViews) * 100 
      : 0;

    await run(
      `UPDATE analytics 
       SET likes = ?, shares = ?, comments = ?, views = ?, clicks = ?, engagement_rate = ?
       WHERE id = ?`,
      [finalLikes, finalShares, finalComments, finalViews, finalClicks, engagementRate, req.params.id]
    );

    const analytics = await get('SELECT * FROM analytics WHERE id = ?', [req.params.id]);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
