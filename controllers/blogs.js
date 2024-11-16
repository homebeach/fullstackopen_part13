const router = require('express').Router();
const { Blog, User } = require('../models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const tokenExtractor = require('../middleware/tokenExtractor');

// Middleware to find a blog by ID
const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id);
    if (!req.blog) {
      const error = new Error('Blog not found');
      error.name = 'NotFoundError';
      throw error;
    }
    next();
  } catch (error) {
    next(error); // Forward error to centralized error handler
  }
};

// GET /api/blogs: List all blogs
router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      include: {
        model: User,
        attributes: ['username', 'name'],
      },
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// POST /api/blogs: Add a new blog
router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const { author, title, url, likes } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const user = await User.findByPk(req.decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const blog = await Blog.create({
      author,
      title,
      url,
      likes: likes || 0,
      userId: user.id,
    });

    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

// PUT /api/blogs/:id: Update blog likes or other fields
router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    const { likes } = req.body;

    if (likes !== undefined && typeof likes !== 'number') {
      const error = new Error("'likes' must be a number");
      error.name = 'ValidationError';
      throw error;
    }

    if (likes !== undefined) {
      req.blog.likes = likes;
    }

    await req.blog.save();
    res.json(likes !== undefined ? { likes: req.blog.likes } : req.blog);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    // Ensure the user trying to delete the blog is the one who created it
    if (req.blog.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'You can only delete your own blogs' });
    }

    // Delete the blog if the user is the owner
    await req.blog.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
