const { DataTypes } = require('sequelize');  // Import only DataTypes

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,  // This is the correct usage
      defaultValue: false,      // New users will be enabled by default
      allowNull: false,         // Ensure the column cannot be null
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'disabled');
  },
};