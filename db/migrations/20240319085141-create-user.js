"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      name: { type: Sequelize.TEXT },
      chatId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Chats",
          key: "id",
        },
      },
      role: {
        type: Sequelize.TEXT,
      },
      money: { type: Sequelize.INTEGER },
      strength: { type: Sequelize.INTEGER },
      intelligence: { type: Sequelize.INTEGER },
      condition: {
        type: Sequelize.TEXT,
      },
      username: {
        type: Sequelize.TEXT,
      },
      nickname: {
        type: Sequelize.TEXT,
      },
      upgradeAt: {
        type: Sequelize.DATE,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
