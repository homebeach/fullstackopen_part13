const router = require('express').Router();
const { Blog } = require('../models');

// Middleware to find a blog by ID
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

// GET /api/blogs: List all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

// POST /api/blogs: Add a new blog
router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/blogs/:id: Fetch a single blog by ID
router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

// DELETE /api/blogs/:id: Delete a blog by ID
router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  try {
    // Check if only `likes` is being updated
    if (req.body.likes !== undefined && Object.keys(req.body).length === 1) {
      req.blog.likes = req.body.likes;
      await req.blog.save();
      return res.json({ likes: req.blog.likes }); // Return only the updated likes
    }

    // Update other fields if provided
    Object.keys(req.body).forEach((key) => {
      if (req.blog[key] !== undefined) {
        req.blog[key] = req.body[key];
      }
    });

    await req.blog.save();
    res.json(req.blog); // Return the full blog object
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
