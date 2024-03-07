"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PERMISSION extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PERMISSION.belongsToMany(models.GROUP, {
        through: "PERMISSION_ROLE",
        foreignKey: "PERMISSION_ID",
        targetKey: "id",
      });
    }
  }
  PERMISSION.init(
    {
      PERMISSION_NAME: DataTypes.STRING,
      URL: DataTypes.STRING,
      DESCRIPTION: DataTypes.STRING,
      ACTION: DataTypes.STRING,
      PERMISSION_PARENT: DataTypes.INTEGER,
      PERMISSION_STATUS: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PERMISSION",
    }
  );
  return PERMISSION;
};
