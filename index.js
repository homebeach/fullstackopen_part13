require('dotenv').config();
require('express-async-errors'); // Automatically catches async errors

const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

// Import the blogs router
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

// Import the centralized error handler middleware
const errorHandler = require('./middleware/errorHandler');

// Middleware for parsing JSON request bodies
app.use(express.json());

// Use the blogsRouter for API routes
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// Centralized error handling middleware
app.use(errorHandler);

// Start the application
const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
