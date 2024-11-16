const router = require('express').Router();
const { Blog } = require('../models');
const { fn, col, literal } = require('sequelize');


// GET /api/authors: Return the number of blogs and total likes for each author
router.get('/', async (req, res, next) => {
  try {
    const authorsStats = await Blog.findAll({
      attributes: [
        'author',
        [fn('COUNT', col('id')), 'articles'], // Count the number of blogs for each author
        [fn('SUM', col('likes')), 'likes'],   // Sum the total likes for each author
      ],
      group: ['author'],                      // Group by author
      order: [[literal('likes'), 'DESC']],    // Order by likes in descending order
    });

    res.json(authorsStats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
