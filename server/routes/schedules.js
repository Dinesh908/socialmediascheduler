const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../database/db');

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await all(`
      SELECT s.*, p.content, p.media_url 
      FROM schedules s
      JOIN posts p ON s.post_id = p.id
      ORDER BY s.scheduled_time DESC
    `);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schedules by platform
router.get('/platform/:platform', async (req, res) => {
  try {
    const platform = req.params.platform.toLowerCase();
    const schedules = await all(`
      SELECT s.*, p.content, p.media_url 
      FROM schedules s
      JOIN posts p ON s.post_id = p.id
      WHERE s.platform = ?
      ORDER BY s.scheduled_time DESC
    `, [platform]);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single schedule
router.get('/:id', async (req, res) => {
  try {
    const schedule = await get(`
      SELECT s.*, p.content, p.media_url 
      FROM schedules s
      JOIN posts p ON s.post_id = p.id
      WHERE s.id = ?
    `, [req.params.id]);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new schedule
router.post('/', async (req, res) => {
  try {
    const { post_id, platform, scheduled_time } = req.body;
    
    if (!post_id || !platform || !scheduled_time) {
      return res.status(400).json({ error: 'post_id, platform, and scheduled_time are required' });
    }

    const validPlatforms = ['facebook', 'twitter', 'instagram'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({ error: 'Platform must be facebook, twitter, or instagram' });
    }

    // Verify post exists
    const post = await get('SELECT * FROM posts WHERE id = ?', [post_id]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const id = uuidv4();
    await run(
      'INSERT INTO schedules (id, post_id, platform, scheduled_time) VALUES (?, ?, ?, ?)',
      [id, post_id, platform.toLowerCase(), scheduled_time]
    );

    const schedule = await get(`
      SELECT s.*, p.content, p.media_url 
      FROM schedules s
      JOIN posts p ON s.post_id = p.id
      WHERE s.id = ?
    `, [id]);
    
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a schedule
router.put('/:id', async (req, res) => {
  try {
    const { scheduled_time, status } = req.body;
    const existingSchedule = await get('SELECT * FROM schedules WHERE id = ?', [req.params.id]);
    
    if (!existingSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const updateFields = [];
    const params = [];

    if (scheduled_time !== undefined) {
      updateFields.push('scheduled_time = ?');
      params.push(scheduled_time);
    }

    if (status !== undefined) {
      const validStatuses = ['pending', 'published', 'failed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status must be pending, published, or failed' });
      }
      updateFields.push('status = ?');
      params.push(status);
      
      if (status === 'published') {
        updateFields.push('published_at = CURRENT_TIMESTAMP');
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    params.push(req.params.id);
    await run(
      `UPDATE schedules SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    const schedule = await get(`
      SELECT s.*, p.content, p.media_url 
      FROM schedules s
      JOIN posts p ON s.post_id = p.id
      WHERE s.id = ?
    `, [req.params.id]);
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await get('SELECT * FROM schedules WHERE id = ?', [req.params.id]);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    await run('DELETE FROM schedules WHERE id = ?', [req.params.id]);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
