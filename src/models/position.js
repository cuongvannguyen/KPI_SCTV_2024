"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class POSITION extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      POSITION.hasMany(models.USER, { foreignKey: "POSITION_ID" });
    }
  }
  POSITION.init(
    {
      NAME_VI: DataTypes.STRING,
      NAME_EN: DataTypes.STRING,
      DESCRIPTION: DataTypes.STRING,
      EMAIL: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "POSITION",
    }
  );
  return POSITION;
};
