const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readingList'); // Import the ReadingList model
const Session = require('./session'); // Import the ReadingList model

// User to Blog (One-to-Many)
User.hasMany(Blog, { foreignKey: 'user_id' });
Blog.belongsTo(User, { foreignKey: 'user_id' });

// User to Blog through ReadingList (Many-to-Many)
User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'readingList', // Alias for User's reading list
  foreignKey: 'user_id',
  otherKey: 'blog_id',
});

Blog.belongsToMany(User, {
  through: ReadingList,
  as: 'readers', // Alias for Blog's readers
  foreignKey: 'blog_id',
  otherKey: 'user_id',
});

module.exports = {
  Blog,
  User,
  ReadingList,
  Session
};
