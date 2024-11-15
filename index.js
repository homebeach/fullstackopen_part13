require('dotenv').config();

const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

const sequelize = new Sequelize(process.env.DATABASE_URL);

// Define the Blog model
class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  }
);

// Ensure the database schema is up-to-date
Blog.sync();

// GET api/blogs: List all blogs
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

// POST api/blogs: Add a new blog
app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE api/blogs/:id: Delete a blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findByPk(id);

  if (blog) {
    await blog.destroy();
    res.status(204).end(); // Success, no content
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
