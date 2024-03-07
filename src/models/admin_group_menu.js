"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ADMIN_GROUP_MENU extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  ADMIN_GROUP_MENU.init(
    {
      GROUP_ID: DataTypes.INTEGER,
      MENU_ID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ADMIN_GROUP_MENU",
    }
  );
  return ADMIN_GROUP_MENU;
};
