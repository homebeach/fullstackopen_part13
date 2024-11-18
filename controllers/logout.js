const express = require('express');
const { Session } = require('../models'); // Updated to LoginSession
const tokenExtractor = require('../middleware/tokenExtractor');

const router = express.Router();

// Use tokenExtractor middleware to extract token and user
router.delete('/', tokenExtractor, async (req, res) => {
  try {
    // Remove the session from the database using the token
    await Session.destroy({ where: { token: req.token } });

    res.status(204).send(); // No content, successful logout
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while logging out' });
  }
});

module.exports = router;
