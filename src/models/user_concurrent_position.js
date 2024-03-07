"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class USER_CONCURRENT_POSITION extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  USER_CONCURRENT_POSITION.init(
    {
      USER_ID: DataTypes.INTEGER,
      CONCURRENT_ID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "USER_CONCURRENT_POSITION",
    }
  );
  return USER_CONCURRENT_POSITION;
};
