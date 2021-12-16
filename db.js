const { Sequelize } = require('sequelize');

const db = new Sequelize(
  "postgres://bwkwbhskdgaylo:2192e42a3c0e879dd70b295cf72f763eb1a5fa7f8b822f11d4afe4cbdc577050@ec2-52-31-201-170.eu-west-1.compute.amazonaws.com:5432/dhmu7s2sko2fd",
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

module.exports = db;