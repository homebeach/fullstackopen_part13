const router = require('express').Router();
const { User, Blog } = require('../models');

// Middleware to find a user by username
const userFinder = async (req, res, next) => {
  try {
    req.user = await User.findOne({ where: { username: req.params.username } });
    if (!req.user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }
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
router.put('/:username', userFinder, async (req, res, next) => {
  try {
    const { newUsername } = req.body;

    if (!newUsername) {
      const error = new Error('New username is required');
      error.name = 'ValidationError';
      throw error;
    }

    req.user.username = newUsername;
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
