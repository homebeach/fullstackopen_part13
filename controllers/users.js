const router = require('express').Router();
const { User, Blog, ReadingList } = require('../models');

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

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        as: 'readingList', // Match the alias defined in the association
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'], // Blog attributes
        through: {
          attributes: ['read', 'id'], // Attributes from the join table (ReadingList)
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Format the user's data along with their reading list
    const userData = {
      name: user.name,
      username: user.username,
      readings: user.readingList.map(blog => ({
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
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
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
