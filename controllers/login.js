const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { SECRET } = require('../util/config');
const { User, Session } = require('../models');

router.post('/', async (request, response) => {
  const { username, password } = request.body;

  // Find the user by username
  const user = await User.findOne({
    where: { username },
  });

  const passwordCorrect = password === 'salainen'; // Hardcoded password for simplicity

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  // Check if the user is disabled
  if (user.disabled) {
    return response.status(403).json({ error: 'User is disabled' });
  }

  // Invalidate existing sessions if necessary
  const existingSession = await Session.findOne({ where: { userId: user.id } });
  if (existingSession) {
    await existingSession.destroy(); // Optionally remove old sessions before creating a new one
  }

  // Generate a new token
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  // Log the session into the sessions table
  await Session.create({
    userId: user.id,
    token,
  });

  response.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
