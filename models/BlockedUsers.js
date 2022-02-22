const { Model, DataTypes, literal } = require("sequelize");
const sequelize = require("../db");

class BlockedUsers extends Model {}

BlockedUsers.init(
  {
    blockedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    blockedUser: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  { sequelize, modelName: "blocked_users" }
);

module.exports = BlockedUsers;
