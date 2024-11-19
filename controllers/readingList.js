// routes/readingList.js
const express = require('express');
const { ReadingList, User, Blog } = require('../models'); // Import the models
const router = express.Router();
const tokenExtractor = require('../middleware/tokenExtractor');

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const { blogId } = req.body;

    // Check if the blog exists
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // The `tokenExtractor` middleware ensures `req.user` is attached and valid
    const user = req.user;

    // Check if the user's account is disabled
    if (user.disabled) {
      return res.status(403).json({ error: 'User is disabled and cannot add to the reading list.' });
    }

    // Create an entry in the ReadingList table
    await ReadingList.create({
      user_id: user.id, // Use the authenticated user's ID
      blog_id: blogId,
      read: false, // Default to false since it's not read yet
    });

    res.status(201).json({
      message: `Blog with ID ${blogId} added to the reading list of User with ID ${user.id}`,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/readinglists/:id - Mark a blog as read
router.put('/:id', tokenExtractor, async (req, res, next) => {
  const { id } = req.params;
  const { read } = req.body;

  if (typeof read !== 'boolean') {
    return res.status(400).json({ error: 'Invalid read status. Must be a boolean.' });
  }

  try {
    // The `tokenExtractor` middleware already ensures the user exists and is not disabled.
    const user = req.user;

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
