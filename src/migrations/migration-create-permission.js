"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PERMISSION", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      PERMISSION_NAME: {
        type: Sequelize.STRING,
      },

      URL: {
        type: Sequelize.STRING,
      },
      DESCRIPTION: {
        type: Sequelize.STRING,
      },

      ACTION: {
        type: Sequelize.STRING,
      },

      PERMISSION_PARENT: {
        type: Sequelize.INTEGER,
      },

      PERMISSION_STATUS: {
        type: Sequelize.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("PERMISSION");
  },
};
