const { Sequelize } = require("sequelize");

const db = new Sequelize(
  "postgres://sgebpejqatsrij:d204e97d88b0a27ee04000b25f1ce9c6888e7583fa10d685eec43208ac37d1bf@ec2-34-253-116-145.eu-west-1.compute.amazonaws.com:5432/dcufckmt9d32ac",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

// db.sync({ alter: true, drop: false });

module.exports = db;
