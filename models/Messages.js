const { Model, DataTypes, literal } = require("sequelize");
const sequelize = require("../db");

class Messages extends Model {}

Messages.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
    },
    sentBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    sentTo: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    forwarded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    forwardedFrom: {
      type: DataTypes.INTEGER,
      references: {
        model: "messages",
        key: "id",
      },
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sentimentScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "messages" }
);

module.exports = Messages;
