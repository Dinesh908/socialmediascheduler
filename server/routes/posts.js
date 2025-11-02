const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../database/db');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await all('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { content, media_url } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const id = uuidv4();
    await run(
      'INSERT INTO posts (id, content, media_url) VALUES (?, ?, ?)',
      [id, content.trim(), media_url || null]
    );

    const post = await get('SELECT * FROM posts WHERE id = ?', [id]);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  try {
    const { content, media_url } = req.body;
    const existingPost = await get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await run(
      'UPDATE posts SET content = ?, media_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content || existingPost.content, media_url !== undefined ? media_url : existingPost.media_url, req.params.id]
    );

    const post = await get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await run('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
