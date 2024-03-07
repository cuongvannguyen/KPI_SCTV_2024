"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("USER", {
      _id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      EMAIL: {
        type: Sequelize.STRING,
      },
      PASSWORD: {
        type: Sequelize.STRING,
      },

      USER_LASTNAME: {
        type: Sequelize.STRING,
      },
      USER_FIRSTNAME: {
        type: Sequelize.STRING,
      },
      USER_STATUS: {
        type: Sequelize.INTEGER,
      },
      GROUP_ID: {
        type: Sequelize.INTEGER,
      },
      POSITION_ID: {
        type: Sequelize.INTEGER,
      },
      USER_GENDER: {
        type: Sequelize.STRING,
      },

      AVATAR_LINK: {
        type: Sequelize.STRING,
      },

      AVATAR_PATH: {
        type: Sequelize.STRING,
      },

      USER_PHONE: {
        type: Sequelize.STRING,
      },
      LAST_LOGIN_DATE: {
        type: Sequelize.DATE,
      },
      LAST_LOGIN_IP: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("USER");
  },
};
