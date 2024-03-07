"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PERMISSION_ROLE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  PERMISSION_ROLE.init(
    {
      GROUP_ID: DataTypes.INTEGER,
      PERMISSION_ID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PERMISSION_ROLE",
    }
  );
  return PERMISSION_ROLE;
};
