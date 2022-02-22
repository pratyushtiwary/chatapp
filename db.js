const { Sequelize } = require("sequelize");

const db = new Sequelize(
  "postgres://qaoqeapnwajafu:c691f6bc9b078d0edad825cfd09855a45611b76022be111fd1e4fe1bf1d73219@ec2-52-208-185-143.eu-west-1.compute.amazonaws.com:5432/d2f9ehnbu6k5in",
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
