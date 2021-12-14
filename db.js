const { Sequelize } = require('sequelize');

const db = new Sequelize("postgres://pskcszopqtsrot:57ccc506eb6568458b71e6a47c0d8095893baca69dda222c0f9b62ff5d42e8fd@ec2-176-34-105-15.eu-west-1.compute.amazonaws.com:5432/d51crngfdp14kr",{
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
    }
});

module.exports = db;