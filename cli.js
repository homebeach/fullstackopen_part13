require('dotenv').config();

const { Sequelize, Model, DataTypes } = require('sequelize');

// Initialize Sequelize with the database URL from environment variables
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

(async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Fetch all blogs from the database
    const blogs = await Blog.findAll();

    // Print blogs in the specified format
    console.log('Executing (default): SELECT * FROM blogs');
    blogs.forEach((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });

    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
