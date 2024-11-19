const jwt = require('jsonwebtoken');
const { Session, User } = require('../models'); // Use renamed model
const { SECRET } = require('../util/config');

const tokenExtractor = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET);

    // Check if the session exists and is active
    const session = await Session.findOne({ where: { token, userId: decoded.id } }); // Use correct field names
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if the user exists and is active
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.disabled) {
      return res.status(403).json({ error: 'User is disabled' });
    }

    req.user = user; // Attach user information to the request
    req.token = token; // Optionally attach token for further use
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = tokenExtractor;
