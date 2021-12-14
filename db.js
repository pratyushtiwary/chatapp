const { Sequelize } = require('sequelize');

const db = new Sequelize("chatapp","root","",{
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    // logging: false
});

module.exports = db;