"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CONCURRENT_POSITION extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // CONCURRENT_POSITION.hasMany(models.USER, { foreignKey: "POSITION_ID" });
    }
  }
  CONCURRENT_POSITION.init(
    {
      CRITERIAL_NAME: DataTypes.STRING,
      SCORE: DataTypes.INTEGER,
      NOTE: DataTypes.STRING,
      STATE: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CONCURRENT_POSITION",
    }
  );
  return CONCURRENT_POSITION;
};
