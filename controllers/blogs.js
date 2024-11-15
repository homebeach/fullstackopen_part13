const router = require('express').Router();
const { Blog } = require('../models');

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
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// POST /api/blogs: Add a new blog
router.post('/', async (req, res, next) => {
  try {
    const { author, title, url, likes } = req.body;

    if (!title || !url) {
      const error = new Error('Title and URL are required');
      error.name = 'ValidationError';
      throw error;
    }

    const blog = await Blog.create({ author, title, url, likes: likes || 0 });
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

// DELETE /api/blogs/:id: Delete a blog by ID
router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
    await req.blog.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
