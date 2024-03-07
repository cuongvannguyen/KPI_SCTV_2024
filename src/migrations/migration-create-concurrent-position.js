"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CONCURRENT_POSITION", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      CRITERIAL_NAME: {
        type: Sequelize.STRING,
      },
      SCORE: {
        type: Sequelize.INTEGER,
      },
      NOTE: {
        type: Sequelize.STRING,
      },
      STATE: {
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
    await queryInterface.dropTable("CONCURRENT_POSITION");
  },
};
