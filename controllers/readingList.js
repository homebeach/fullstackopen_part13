// routes/readingList.js
const express = require('express');
const { ReadingList, User, Blog } = require('../models'); // Import the models
const router = express.Router();
const tokenExtractor = require('../middleware/tokenExtractor');

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

// PUT /api/readinglists/:id - Mark a blog as read
router.put('/:id', tokenExtractor, async (req, res, next) => {
  const { id } = req.params; // ID of the ReadingList entry
  const { read } = req.body; // New read status

  // Validate the "read" field
  if (typeof read !== 'boolean') {
    return res.status(400).json({ error: 'Invalid read status. Must be a boolean.' });
  }

  try {
    // Fetch the user based on the token
    const user = await User.findByPk(req.decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the ReadingList entry by its ID
    const readingListEntry = await ReadingList.findByPk(id);

    if (!readingListEntry) {
      return res.status(404).json({ error: 'Reading list entry not found.' });
    }

    // Ensure the ReadingList entry belongs to the user
    if (readingListEntry.user_id !== user.id) {
      return res.status(403).json({ error: 'You are not authorized to modify this entry.' });
    }

    // Update the read status
    readingListEntry.read = read;
    await readingListEntry.save();

    res.status(200).json({
      message: `Reading list entry ${id} updated successfully.`,
      data: {
        id: readingListEntry.id,
        user_id: readingListEntry.user_id,
        blog_id: readingListEntry.blog_id,
        read: readingListEntry.read,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
