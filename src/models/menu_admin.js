"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MENU_ADMIN extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  MENU_ADMIN.init(
    {
      MENU_NAME_VI: DataTypes.STRING,
      MENU_NAME_EN: DataTypes.STRING,
      MENU_LINK: DataTypes.STRING,
      MENU_PARENT: DataTypes.INTEGER,
      MENU_LEVER: DataTypes.INTEGER,
      MENU_ORDER: DataTypes.INTEGER,
      MENU_STATUS: DataTypes.INTEGER,
      MENU_ICON: DataTypes.STRING,
      MENU_ICON_REACT: DataTypes.STRING,
      MENU_BULLET: DataTypes.INTEGER,
      MENU_CATEGORY: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "MENU_ADMIN",
    }
  );
  return MENU_ADMIN;
};
