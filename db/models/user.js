"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Chat }) {
      this.belongsTo(Chat, { foreignKey: "chatId" });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      name: { type: DataTypes.TEXT },
      chatId: {
        type: DataTypes.BIGINT,
        references: {
          model: "Chats",
          key: "id",
        },
      },
      role: {
        type: DataTypes.TEXT,
      },
      money: { type: DataTypes.INTEGER },
      strength: { type: DataTypes.INTEGER },
      intelligence: { type: DataTypes.INTEGER },
      condition: {
        type: DataTypes.TEXT,
      },
      username: {
        type: DataTypes.TEXT,
      },
      upgradeAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
