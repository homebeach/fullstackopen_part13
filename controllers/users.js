const router = require('express').Router();
const { User, Blog } = require('../models');
const tokenExtractor = require('../middleware/tokenExtractor');

// Middleware to find a user by ID
const userFinderById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user; // Attach the user to the request
    next();
  } catch (error) {
    next(error);
  }
};

// GET /api/users: List all users, each showing the blogs they have added
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: ['title', 'author', 'url', 'likes'],
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id: Get a user's reading list with optional filters
router.get('/:id', userFinderById, async (req, res, next) => {
  const { read } = req.query; // Extract query parameter

  try {
    // Filter condition for the query
    const readFilter =
      read === undefined
        ? {} // No filter if the query parameter is not provided
        : { read: read === 'true' }; // Convert "read" to boolean if provided

    // Fetch the user's reading list with the optional read filter
    const userWithReadingList = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        as: 'readingList', // Match the alias defined in the association
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'], // Blog attributes
        through: {
          attributes: ['read', 'id'], // Attributes from the join table (ReadingList)
          where: readFilter, // Apply the read filter
        },
      },
    });

    // Format the response
    const userData = {
      name: req.user.name,
      username: req.user.username,
      readings: userWithReadingList.readingList.map(blog => ({
        id: blog.id,
        url: blog.url,
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
        year: blog.year,
        readinglists: [
          {
            read: blog.reading_list.read, // Access the 'read' field from the join table
            id: blog.reading_list.id, // Access the ID from the join table
          },
        ],
      })),
    };

    res.json(userData);
  } catch (error) {
    next(error);
  }
});

// POST /api/users: Add a new user
router.post('/', async (req, res, next) => {
  try {
    const { username, name } = req.body;

    if (!username || !name) {
      const error = new Error('Username and name are required');
      error.name = 'ValidationError';
      throw error;
    }

    const user = await User.create({ username, name });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:username: Change username
router.put('/:username', tokenExtractor, async (req, res, next) => {
  try {
    const { newUsername } = req.body;

    // Validate the new username input
    if (!newUsername) {
      return res.status(400).json({ error: 'New username is required' });
    }

    // Ensure the logged-in user matches the target username
    if (req.user.username !== req.params.username) {
      return res.status(403).json({ error: 'You can only change your own username' });
    }

    // Check if the user is disabled
    if (req.user.disabled) {
      return res.status(403).json({ error: 'Your account is disabled and cannot be modified' });
    }

    // Update the username
    req.user.username = newUsername;
    await req.user.save();

    res.json({ message: 'Username updated successfully', user: req.user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
