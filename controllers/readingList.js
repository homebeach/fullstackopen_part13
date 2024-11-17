// routes/readingList.js
const express = require('express');
const { ReadingList, User, Blog } = require('../models'); // Import the models
const router = express.Router();

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body;

  try {
    // Find the user and blog to ensure they exist
    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Manually create an entry in the ReadingList table
    await ReadingList.create({
      user_id: userId,
      blog_id: blogId,
      read: false,  // Default to false since it's not read yet
    });

    res.status(201).json({
      message: `Blog with ID ${blogId} added to the reading list of User with ID ${userId}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding to the reading list' });
  }
});

module.exports = router;
