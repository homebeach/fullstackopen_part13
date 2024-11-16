const errorHandler = (error, req, res, next) => {
  console.error('Error details:', error); // Log for debugging

  if (error.name === 'SequelizeValidationError') {
    // Extract validation error messages
    const messages = error.errors.map(e => e.message);
    return res.status(400).json({ error: messages });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    // Handle unique constraint error
    const messages = error.errors.map(e => `${e.path} must be unique`);
    return res.status(400).json({ error: messages });
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: error.message });
  }

  // Generic error fallback
  return res.status(500).json({ error: 'Something went wrong' });
};

module.exports = errorHandler;
