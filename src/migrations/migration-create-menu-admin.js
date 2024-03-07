"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MENU_ADMIN", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      MENU_NAME_VI: {
        type: Sequelize.STRING,
      },
      MENU_NAME_EN: {
        type: Sequelize.STRING,
      },
      MENU_LINK: {
        type: Sequelize.STRING,
      },
      MENU_PARENT: {
        type: Sequelize.INTEGER,
      },
      MENU_LEVER: {
        type: Sequelize.INTEGER,
      },
      MENU_ORDER: {
        type: Sequelize.INTEGER,
      },
      MENU_STATUS: {
        type: Sequelize.INTEGER,
      },
      MENU_ICON: {
        type: Sequelize.STRING,
      },

      MENU_ICON_REACT: {
        type: Sequelize.STRING,
      },
      MENU_BULLET: {
        type: Sequelize.INTEGER,
      },

      MENU_CATEGORY: {
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
    await queryInterface.dropTable("MENU_ADMIN");
  },
};
