require('dotenv').config();
require('express-async-errors'); // Automatically catches async errors

const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const authorsRouter = require('./controllers/authors');
const loginRouter = require('./controllers/login');
const readingListRouter = require('./controllers/readingList');

// Import the centralized error handler middleware
const errorHandler = require('./middleware/errorHandler');

// Middleware for parsing JSON request bodies
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/login', loginRouter);
app.use('/api/readinglists', readingListRouter);


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
