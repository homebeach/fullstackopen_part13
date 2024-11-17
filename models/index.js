const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readingList'); // Import the ReadingList model

// User to Blog (One-to-Many)
User.hasMany(Blog, { foreignKey: 'user_id' }); // A user can have many blogs
Blog.belongsTo(User, { foreignKey: 'user_id' }); // A blog belongs to a single user

// User to Blog through ReadingList (Many-to-Many)
User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'readingList',
  foreignKey: 'user_id', // Key in ReadingList for User
  otherKey: 'blog_id',   // Key in ReadingList for Blog
});

Blog.belongsToMany(User, {
  through: ReadingList,
  as: 'readers',
  foreignKey: 'blog_id', // Key in ReadingList for Blog
  otherKey: 'user_id',   // Key in ReadingList for User
});

module.exports = {
  Blog,
  User,
  ReadingList, // Export ReadingList for other modules
};
