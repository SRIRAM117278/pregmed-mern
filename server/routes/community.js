const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const { verifyToken } = require('../middleware/auth');

// Get all community posts
router.get('/', async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('userId', 'firstName lastName')
      .populate('comments.userId', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create community post
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    const post = new CommunityPost({
      userId: req.userId,
      title,
      content,
      category,
    });

    await post.save();
    await post.populate('userId', 'firstName lastName');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like post
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (post.likes.includes(req.userId)) {
      post.likes = post.likes.filter(id => id.toString() !== req.userId);
    } else {
      post.likes.push(req.userId);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment
router.post('/:id/comment', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { userId: req.userId, text } } },
      { new: true }
    ).populate('comments.userId', 'firstName lastName');
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
