const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class ReadingList extends Model {}

ReadingList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default to unread
    },
  },
  {
    sequelize,
    underscored: true, // Use snake_case for database column names
    timestamps: true,
    modelName: 'reading_list',
    tableName: 'reading_lists', // Ensure this matches the database table name
  }
);

module.exports = ReadingList;
